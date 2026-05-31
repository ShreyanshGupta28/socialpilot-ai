import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[#0A0F1E] text-[#F0F4FF] py-16 px-6">
      <div className="max-w-3xl mx-auto space-y-8">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted hover:text-white transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to home
        </Link>
        <h1 className="text-3xl sm:text-4xl font-extrabold font-syne text-white tracking-wide border-b border-white/5 pb-4">
          Terms of Service
        </h1>
        <div className="text-sm sm:text-base text-muted space-y-6 leading-relaxed">
          <p>
            Effective Date: May 30, 2026
          </p>
          <p>
            By accessing or using SocialPilot AI (&quot;the Service&quot;), you agree to be bound by these Terms of Service. If you do not agree, please do not access or use our application.
          </p>
          
          <h2 className="text-lg font-bold font-syne text-white pt-2">1. Use of the Service</h2>
          <p>
            You must be at least 18 years of age to register for an account. You are solely responsible for maintaining the confidentiality of your login credentials and for all actions taken under your account.
          </p>

          <h2 className="text-lg font-bold font-syne text-white pt-2">2. Usage Limitations</h2>
          <p>
            Free tier members are limited to 30 generations a day. Bypassing these credit limits via automated scripts or multiple accounts is strictly prohibited. Premium users enjoy unlimited queries, subject to reasonable fair use policies to avoid server abuse.
          </p>

          <h2 className="text-lg font-bold font-syne text-white pt-2">3. Subscription Billing & Cancellations</h2>
          <p>
            Premium upgrades are charged as recurring monthly subscriptions. Payments are handled via Stripe. You can cancel your subscription inside settings at any time, keeping premium features active until your current period end date.
          </p>

          <h2 className="text-lg font-bold font-syne text-white pt-2">4. Disclaimers of Liability</h2>
          <p>
            SocialPilot AI provides templates generated via automated intelligence. We do not guarantee the correctness of the generated copies. You assume full responsibility for reviewing drafts before publishing them on public platforms.
          </p>
        </div>
      </div>
    </main>
  );
}
