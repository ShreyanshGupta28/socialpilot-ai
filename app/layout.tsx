import type { Metadata } from "next";
import { Inter, Syne } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";
import React from "react";

// Client Provider Wrapper
import { Providers } from "./providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Creator Studio ✨",
  description:
    "Manage collaborations, templates, opportunities, and creator communications in one beautiful place.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${syne.variable}`}>
      <body className="antialiased min-h-screen bg-[#FFFDF8] text-[#334155]">
        <Providers>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: "#FFFFFF",
                color: "#334155",
                border: "1px solid rgba(249, 168, 212, 0.2)",
                borderRadius: "16px",
                boxShadow: "0 10px 25px -5px rgba(167, 139, 250, 0.08)",
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
