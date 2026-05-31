import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { sendWelcomePremiumEmail } from "@/lib/resend";
import Stripe from "stripe";

export async function POST(request: Request) {
  let rawBody = "";
  try {
    rawBody = await request.text();
  } catch (err) {
    console.error("Webhook raw body read failed:", err);
    return NextResponse.json({ error: "Read body failed" }, { status: 400 });
  }

  const sig = request.headers.get("stripe-signature") || "";
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "";

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
  } catch (err: any) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  console.log(`Processing Stripe Webhook Event: ${event.type}`);

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        
        if (session.mode === "subscription") {
          const subscriptionId = session.subscription as string;
          const stripeCustomerId = session.customer as string;
          
          // Retrieve full subscription details to get current_period_end
          const sub = await stripe.subscriptions.retrieve(subscriptionId);
          
          const userId = session.metadata?.userId || null;
          
          let targetUserId = userId;
          
          if (!targetUserId && session.customer_details?.email) {
            const userObj = await prisma.user.findUnique({
              where: { email: session.customer_details.email.toLowerCase() },
            });
            if (userObj) targetUserId = userObj.id;
          }

          if (targetUserId) {
            const userEmail = session.customer_details?.email || "";
            
            // Perform atomic transaction
            await prisma.$transaction(async (tx) => {
              // 1. Update user plan
              await tx.user.update({
                where: { id: targetUserId! },
                data: { plan: "PREMIUM" },
              });

              // 2. Upsert subscription details
              await tx.subscription.upsert({
                where: { stripeSubscriptionId: subscriptionId },
                create: {
                  userId: targetUserId!,
                  stripeCustomerId,
                  stripeSubscriptionId: subscriptionId,
                  stripePriceId: sub.items.data[0].price.id,
                  status: sub.status,
                  currentPeriodEnd: new Date(sub.current_period_end * 1000),
                  cancelAtPeriodEnd: sub.cancel_at_period_end,
                },
                update: {
                  status: sub.status,
                  currentPeriodEnd: new Date(sub.current_period_end * 1000),
                  cancelAtPeriodEnd: sub.cancel_at_period_end,
                  stripePriceId: sub.items.data[0].price.id,
                },
              });
            });

            // Send welcoming email
            if (userEmail) {
              await sendWelcomePremiumEmail(userEmail);
            }
          }
        }
        break;
      }

      case "customer.subscription.updated": {
        const sub = event.data.object as Stripe.Subscription;
        const subscriptionId = sub.id;
        const stripeCustomerId = sub.customer as string;

        const dbSub = await prisma.subscription.findFirst({
          where: { stripeCustomerId },
        });

        if (dbSub) {
          const planStatus = (sub.status === "active" || sub.status === "trialing") ? "PREMIUM" : "FREE";

          await prisma.$transaction(async (tx) => {
            // Update User plan
            await tx.user.update({
              where: { id: dbSub.userId },
              data: { plan: planStatus },
            });

            // Update Subscription details
            await tx.subscription.update({
              where: { stripeSubscriptionId: subscriptionId },
              data: {
                status: sub.status,
                currentPeriodEnd: new Date(sub.current_period_end * 1000),
                cancelAtPeriodEnd: sub.cancel_at_period_end,
                stripePriceId: sub.items.data[0].price.id,
              },
            });
          });
        }
        break;
      }

      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        const subscriptionId = sub.id;
        const stripeCustomerId = sub.customer as string;

        const dbSub = await prisma.subscription.findFirst({
          where: { stripeCustomerId },
        });

        if (dbSub) {
          await prisma.$transaction(async (tx) => {
            // Revert User plan back to FREE
            await tx.user.update({
              where: { id: dbSub.userId },
              data: { plan: "FREE" },
            });

            // Deactivate Subscription
            await tx.subscription.update({
              where: { stripeSubscriptionId: subscriptionId },
              data: {
                status: sub.status,
                cancelAtPeriodEnd: true,
              },
            });
          });
        }
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook processing error:", error);
    return NextResponse.json({ error: "Webhook event processing failed" }, { status: 500 });
  }
}
