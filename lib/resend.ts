import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY || "temp_key");
const emailFrom = process.env.EMAIL_FROM || "SocialPilot AI <noreply@socialpilot.ai>";
const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export async function sendVerificationEmail(email: string, token: string): Promise<void> {
  const verifyUrl = `${appUrl}/api/auth/verify?token=${token}`;
  
  try {
    await resend.emails.send({
      from: emailFrom,
      to: email,
      subject: "Verify your email address - SocialPilot AI",
      html: `
        <div style="background-color: #0A0F1E; color: #F0F4FF; padding: 40px; font-family: sans-serif; border-radius: 12px; max-width: 600px; margin: 0 auto; border: 1px solid rgba(255,255,255,0.1);">
          <h2 style="color: #7C3AED; font-family: 'Syne', sans-serif; font-size: 24px;">Welcome to SocialPilot AI!</h2>
          <p style="font-size: 16px; line-height: 1.6; color: #94A3B8;">Thank you for registering. Please verify your email address to unlock your AI Communication Assistant.</p>
          <div style="margin: 30px 0;">
            <a href="${verifyUrl}" style="background-color: #7C3AED; color: #FFFFFF; padding: 12px 24px; text-decoration: none; font-weight: bold; border-radius: 8px; display: inline-block;">Verify Email Address</a>
          </div>
          <p style="font-size: 14px; color: #94A3B8;">Or copy and paste this link in your browser:</p>
          <p style="word-break: break-all; font-size: 12px; color: #5C6BC0;">${verifyUrl}</p>
          <hr style="border: 0; border-top: 1px solid rgba(255,255,255,0.1); margin: 30px 0;" />
          <p style="font-size: 12px; color: #94A3B8;">This verification link will expire in 24 hours. If you did not register for SocialPilot AI, please ignore this email.</p>
        </div>
      `,
    });
  } catch (error) {
    console.error("Error sending verification email via Resend:", error);
  }
}

export async function sendPasswordResetEmail(email: string, token: string): Promise<void> {
  const resetUrl = `${appUrl}/reset-password?token=${token}`;
  
  try {
    await resend.emails.send({
      from: emailFrom,
      to: email,
      subject: "Reset your password - SocialPilot AI",
      html: `
        <div style="background-color: #0A0F1E; color: #F0F4FF; padding: 40px; font-family: sans-serif; border-radius: 12px; max-width: 600px; margin: 0 auto; border: 1px solid rgba(255,255,255,0.1);">
          <h2 style="color: #7C3AED; font-family: 'Syne', sans-serif; font-size: 24px;">Password Reset Request</h2>
          <p style="font-size: 16px; line-height: 1.6; color: #94A3B8;">We received a request to reset your password. Click the button below to set a new password.</p>
          <div style="margin: 30px 0;">
            <a href="${resetUrl}" style="background-color: #7C3AED; color: #FFFFFF; padding: 12px 24px; text-decoration: none; font-weight: bold; border-radius: 8px; display: inline-block;">Reset Password</a>
          </div>
          <p style="font-size: 14px; color: #94A3B8;">Or copy and paste this link in your browser:</p>
          <p style="word-break: break-all; font-size: 12px; color: #5C6BC0;">${resetUrl}</p>
          <hr style="border: 0; border-top: 1px solid rgba(255,255,255,0.1); margin: 30px 0;" />
          <p style="font-size: 12px; color: #94A3B8;">This reset link will expire in 1 hour. If you did not make this request, you can safely ignore this email.</p>
        </div>
      `,
    });
  } catch (error) {
    console.error("Error sending reset password email via Resend:", error);
  }
}


