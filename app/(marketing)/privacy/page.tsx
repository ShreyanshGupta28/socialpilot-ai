import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#0A0F1E] text-[#F0F4FF] py-16 px-6">
      <div className="max-w-3xl mx-auto space-y-8">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted hover:text-white transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to home
        </Link>
        <h1 className="text-3xl sm:text-4xl font-extrabold font-syne text-white tracking-wide border-b border-white/5 pb-4">
          Privacy Policy
        </h1>
        <div className="text-sm sm:text-base text-muted space-y-6 leading-relaxed">
          <p>
            Effective Date: May 30, 2026
          </p>
          <p>
            Welcome to SocialPilot AI (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;). We respect your privacy and are committed to protecting the personal data you share with us. This Privacy Policy explain how we collect, use, and safe-guard your information when you access our application.
          </p>
          
          <h2 className="text-lg font-bold font-syne text-white pt-2">1. Data We Collect</h2>
          <p>
            We collect the email address, name, and billing details provided during registration and premium upgrade checkout. We also securely process message inputs pasted into our tools to generate automated replies via third-party AI APIs (such as OpenAI).
          </p>

          <h2 className="text-lg font-bold font-syne text-white pt-2">2. How We Use Your Data</h2>
          <p>
            Your information is utilized solely to provide our core AI-assisted reply templates, maintain active account records, confirm credentials during logins, and charge subscription plans via our payment processor, Stripe.
          </p>

          <h2 className="text-lg font-bold font-syne text-white pt-2">3. Third Party Integrations</h2>
          <p>
            We share message prompts with OpenAI to generate responses and pass email info to Stripe for checkout sessions. All communications are encrypted and governed by strict compliance agreements.
          </p>

          <h2 className="text-lg font-bold font-syne text-white pt-2">4. Your Data Choices</h2>
          <p>
            You retain absolute ownership over your account data. You can delete your profile, generation history, and billing links at any time within your settings panel, which cascades immediately to delete all database entries.
          </p>
        </div>
      </div>
    </main>
  );
}
