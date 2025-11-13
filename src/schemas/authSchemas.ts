import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string({ message: "Email is required" })
    .min(1, "Email is required")
    .email({ message: "Please enter a valid email address" }),
  password: z
    .string({ message: "Password is required" })
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters"),
});

export const signupSchema = z
  .object({
    fullName: z
      .string()
      .min(1, "Full name is required")
      .min(2, "Full name must be at least 2 characters")
      .max(100, "Full name must not exceed 100 characters"),
    email: z
      .string({ message: "Email is required" })
      .min(1, "Email is required")
      .email({ message: "Please enter a valid email address" }),
    password: z
      .string()
      .min(1, "Password is required")
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number"
      ),
    confirmPassword: z.string().min(1, "Please confirm your password"),
    companyName: z
      .string()
      .min(1, "Company name is required")
      .min(2, "Company name must be at least 2 characters")
      .max(100, "Company name must not exceed 100 characters"),
    selectedIndustry: z.string().min(1, "Please select an industry"),
    agreeToTerms: z.boolean().refine((val) => val === true, {
      message: "You must agree to the terms and conditions",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const forgotPasswordSchema = z.object({
  email: z
    .string({ message: "Email is required" })
    .min(1, "Email is required")
    .email({ message: "Please enter a valid email address" }),
});

export const resetPasswordSchema = z
  .object({
    email: z
      .string({ message: "Email is required" })
      .min(1, "Email is required")
      .email({ message: "Please enter a valid email address" }),
    otpCode: z
      .string()
      .min(6, "Verification code must be 6 digits")
      .max(6, "Verification code must be 6 digits")
      .regex(/^\d{6}$/, "Verification code must be 6 digits"),
    newPassword: z
      .string()
      .min(1, "Password is required")
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
        "Password must contain uppercase, lowercase, number, and special character"
      ),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type LoginFormData = z.infer<typeof loginSchema>;
export type SignupFormData = z.infer<typeof signupSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
