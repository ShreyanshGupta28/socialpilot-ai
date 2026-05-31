import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "./prisma";
import bcryptjs from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email.toLowerCase() },
        });

        if (!user || !user.hashedPassword) {
          return null;
        }

        const isValid = await bcryptjs.compare(credentials.password, user.hashedPassword);
        if (!isValid) {
          return null;
        }

        if (!user.emailVerified) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name ?? "",
          plan: user.plan,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        if (!user.email) {
          return false;
        }

        const existingUser = await prisma.user.findUnique({
          where: { email: user.email.toLowerCase() },
        });

        if (!existingUser) {
          // Register new Google OAuth user
          const newUser = await prisma.user.create({
            data: {
              email: user.email.toLowerCase(),
              name: user.name || "",
              googleId: user.id || account.providerAccountId,
              emailVerified: true,
              plan: "FREE",
              onboardingDone: false,
            },
          });
          user.id = newUser.id;
          user.plan = newUser.plan;
        } else {
          // Link Google ID if not already linked
          if (!existingUser.googleId) {
            await prisma.user.update({
              where: { id: existingUser.id },
              data: {
                googleId: user.id || account.providerAccountId,
                emailVerified: true, // Google accounts are auto-verified
              },
            });
          }
          user.id = existingUser.id;
          user.plan = existingUser.plan;
        }
      }
      return true;
    },
    async jwt({ token, user, trigger, session }) {
      // Direct assignment on initial login
      if (user) {
        token.id = user.id;
        token.plan = user.plan;
      }

      // Allow manual token updating (for plan change triggers)
      if (trigger === "update" && session?.plan) {
        token.plan = session.plan;
      }

      // Check DB periodically to sync subscription updates
      if (token.id && !user) {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.id },
          select: { plan: true },
        });
        if (dbUser) {
          token.plan = dbUser.plan;
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.plan = token.plan as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
};
