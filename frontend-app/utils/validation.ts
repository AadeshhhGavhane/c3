import { z } from 'zod';

// Name validation: 2-50 characters, letters and spaces only
export const nameSchema = z
  .string()
  .min(2, 'Name must be at least 2 characters')
  .max(50, 'Name must be at most 50 characters')
  .regex(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces')
  .trim();

// Email validation: valid email format
export const emailSchema = z
  .string()
  .min(1, 'Email is required')
  .email('Please provide a valid email address')
  .toLowerCase()
  .trim();

// Password validation: at least 6 characters
export const passwordSchema = z
  .string()
  .min(6, 'Password must be at least 6 characters')
  .max(100, 'Password must be at most 100 characters');

// OTP validation: exactly 4 digits
export const otpSchema = z
  .string()
  .length(4, 'OTP must be exactly 4 digits')
  .regex(/^\d{4}$/, 'OTP must contain only digits');

// Sign up validation schema
export const signUpSchema = z
  .object({
    name: nameSchema,
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

// Sign in validation schema
export const signInSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
});

// OTP verification schema
export const verifyOTPSchema = z.object({
  email: emailSchema,
  otp: otpSchema,
});

// Forgot password schema
export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

// Type exports
export type SignUpInput = z.infer<typeof signUpSchema>;
export type SignInInput = z.infer<typeof signInSchema>;
export type VerifyOTPInput = z.infer<typeof verifyOTPSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

