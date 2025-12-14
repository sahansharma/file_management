import { Request, Response, NextFunction } from "express";
import prisma from "../prisma/client";
import { hashPassword, comparePassword } from "../utils/hash";
import { signToken } from "../utils/jwt";
import { AuthRequest } from "../middlewares/auth.middleware";
import { ResponseHandler } from "../utils/responses/responseHandler";
import { ApiError } from "../utils/errors/apiError";
import { z } from "zod";

// schema registration input
const registerSchema = z.object({
  email: z.string().email({ message: "Invalid email format" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .max(32, { message: "Password cannot exceed 32 characters" })
    .refine((val) => /[a-z]/.test(val), { message: "Password must contain at least one lowercase letter" })
    .refine((val) => /[A-Z]/.test(val), { message: "Password must contain at least one uppercase letter" })
    .refine((val) => /\d/.test(val), { message: "Password must contain at least one number" })
    .refine((val) => /[!@#$%^&*(),.?":{}|<>]/.test(val), { message: "Password must contain at least one special character" }),
});

// schema login input
const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email format" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
});

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new ApiError("Validation failed", 400, parsed.error.errors);
    }

    const { email, password } = parsed.data;
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) throw new ApiError("Email already in use", 409);

    const hashed = await hashPassword(password);
    const user = await prisma.user.create({ data: { email, password: hashed } });

    ResponseHandler.success(res, { id: user.id, email: user.email }, "User registered successfully");
  } catch (err) {
    console.error("Register error:", err);
    next(err);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new ApiError("Validation failed", 400, parsed.error.errors);
    }

    const { email, password } = parsed.data;
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !(await comparePassword(password, user.password))) {
      throw new ApiError("Invalid credentials", 401);
    }

    const token = signToken({ userId: user.id }, "1h");
    ResponseHandler.success(res, { token, user: { id: user.id, email: user.email } }, "Login successful");
  } catch (err) {
    console.error("Login error:", err);
    next(err);
  }
};

export const me = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, createdAt: true },
    });

    if (!user) throw new ApiError("User not found", 404);

    ResponseHandler.success(res, { user }, "User fetched successfully");
  } catch (err) {
    console.error("Me endpoint error:", err);
    next(err);
  }
};
