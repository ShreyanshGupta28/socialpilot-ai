import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = session.user.id;

  try {
    const body = await request.json();
    const { priceId } = body; // can be "monthly" or "annual" or specific price ID

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { subscriptions: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Determine target Stripe Price ID
    let stripePriceId = process.env.STRIPE_PREMIUM_MONTHLY_PRICE_ID || "price_monthly_placeholder";
    if (priceId === "annual") {
      stripePriceId = process.env.STRIPE_PREMIUM_ANNUAL_PRICE_ID || "price_annual_placeholder";
    } else if (priceId && priceId !== "monthly") {
      stripePriceId = priceId; // Accept custom price ID directly
    }

    // Determine if we already have a Stripe Customer ID
    let stripeCustomerId = user.subscriptions[0]?.stripeCustomerId || null;

    if (!stripeCustomerId) {
      // Find if another subscription has it, or create a customer
      const existingSub = await prisma.subscription.findFirst({
        where: { userId },
      });
      if (existingSub) {
        stripeCustomerId = existingSub.stripeCustomerId;
      } else {
        const customer = await stripe.customers.create({
          email: user.email,
          name: user.name || undefined,
          metadata: { userId },
        });
        stripeCustomerId = customer.id;
      }
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const sessionConfig: any = {
      payment_method_types: ["card"],
      line_items: [
        {
          price: stripePriceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${appUrl}/dashboard?success=true`,
      cancel_url: `${appUrl}/billing?canceled=true`,
      metadata: { userId },
    };

    if (stripeCustomerId) {
      sessionConfig.customer = stripeCustomerId;
    } else {
      sessionConfig.customer_email = user.email;
    }

    const checkoutSession = await stripe.checkout.sessions.create(sessionConfig);

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error: any) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create Stripe checkout session." },
      { status: 500 }
    );
  }
}
