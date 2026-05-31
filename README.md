# SocialPilot AI 🚀

SocialPilot AI is a production-ready, beautiful, and completely type-safe **AI Communication Assistant** built on Next.js 14 App Router, Tailwind CSS, Prisma, NextAuth, Google Gemini API, and Stripe.

It parses, analyzes, and drafts organic, high-converting response variations for customer comments, DMs, WhatsApp queries, and emails in real-time.

---

## 🌟 Key Features

* **AI Reply Generator**: Drafts 6 tone variations (Professional, Friendly, Empathetic, Bold/Sales, Witty, Direct) optimized for Instagram, WhatsApp, and Email.
* **AI Message Improver**: Refines rough drafts to sound more confident and professional while presenting constructive copywriter tips.
* **Strict Fact Grounding**: Engineered prompts that prevent AI hallucinations, ensuring it never fabricates prices, company policies, shipping costs, or guarantees.
* **Persistent Themes**: Beautiful glassmorphic Light and Dark themes saved automatically in local storage.
* **Client-Side PDF Export**: Export all analysis insights and generated reply alternatives instantly to clean, styled PDF documents.
* **Real-time Activity Search**: Client-side interactive logs filtering instantly as you type.
* **Interactive Analytics Dashboard**: Beautiful visual metrics rollups and custom glowing SVG bar charts querying data directly from SQLite.
* **Strict Session Gateways**: NextAuth session middleware protection guarding all dashboard pages.

---

## 🛠️ Tech Stack

* **Framework**: Next.js 14 (App Router)
* **Styling**: Tailwind CSS
* **Database**: SQLite (via Prisma ORM)
* **AI Engine**: Google Gemini API (`gemini-2.5-flash` via the OpenAI-compatible SDK)
* **Authentication**: NextAuth.js
* **Billing / Subscriptions**: Stripe
* **Transactional Email**: Resend
* **Validation**: Zod + TypeScript

---

## ⚙️ Environment Variables

Copy the `.env.example` file to `.env` in the root of your project:

```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="socialpilot_secret_key_random_value_32_chars"

# AI Configuration
GEMINI_API_KEY="YOUR_GOOGLE_GEMINI_API_KEY"

# Billing
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."

# Email
RESEND_API_KEY="re_..."
EMAIL_FROM="SocialPilot AI <noreply@socialpilot.ai>"
```

---

## 🚀 Installation & Local Setup

1. **Clone & Navigate**:
   ```bash
   cd "SocialPilot AI"
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Prisma DB Sync**:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

4. **Run Local Server**:
   ```bash
   npm run dev
   ```
   Open **[http://localhost:3000](http://localhost:3000)** in your web browser.

---

## 📦 Production Deployment

This project is fully compatible with Vercel:

1. **Connect Repository**: Import the repository on Vercel.
2. **Environment Variables**: Add all variables from `.env` in the project settings.
3. **Trigger Build**: The build command is pre-configured inside `vercel.json` (`npx prisma generate && next build`) ensuring Prisma client generation succeeds on Vercel's host servers.

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
