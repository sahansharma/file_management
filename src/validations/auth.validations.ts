import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .max(32, "Password cannot exceed 32 characters")
    .regex(/[a-z]/, "Must contain one lowercase letter")
    .regex(/[A-Z]/, "Must contain one uppercase letter")
    .regex(/\d/, "Must contain one number")
    .regex(/[!@#$%^&*(),.?":{}|<>]/, "Must contain one special character"),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});
