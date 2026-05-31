import { z } from "zod";

// Authentication
export const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
export type RegisterInput = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});
export type LoginInput = z.infer<typeof loginSchema>;

export const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z.object({
  token: z.string().min(1, "Reset token is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;

// AI Engine
export const generateReplySchema = z.object({
  channel: z.enum(["AUTO", "INSTAGRAM", "WHATSAPP", "EMAIL", "GENERAL"]),
  inputText: z.string().min(1, "Input message is required").max(4000, "Input is too long"),
  selectedTones: z.array(z.string()).min(1, "Select at least one tone"),
  context: z.string().optional(),
});
export type GenerateReplyInput = z.infer<typeof generateReplySchema>;

export const improveMessageSchema = z.object({
  inputText: z.string().min(1, "Draft message is required").max(4000, "Draft is too long"),
  context: z.string().optional(),
});
export type ImproveMessageInput = z.infer<typeof improveMessageSchema>;

// Settings & Profiles
export const updateProfileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
});
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(6, "New password must be at least 6 characters"),
});
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;

// Billing
export const checkoutSchema = z.object({
  priceId: z.string().min(1, "Price ID is required"),
});
export type CheckoutInput = z.infer<typeof checkoutSchema>;
