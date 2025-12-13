import { Request, Response } from "express";
import prisma from "../prisma/client";
import { hashPassword, comparePassword } from "../utils/hash";
import { signToken } from "../utils/jwt";
import { AuthRequest } from "../middlewares/authMiddleware";
import {z} from "zod";

//schema for registration input
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

export const register = async (req: Request, res: Response) => {
  try {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success){
      return res.status(400).json({errors: parsed.error.errors});
    }
    const {email, password} = parsed.data;
    
    const existing = await prisma.user.findUnique({where: {email}});
    if (existing) return res.status(409).json({message: "Email already in use"});

    const hashed = await hashPassword(password);
    const user = await prisma.user.create({data: {email, password: hashed}});

    res.status(201).json({message: "User registered successfully", user: {id: user.id, email: user.email}});
  } catch(err) {
    console.error(err);
    res.status(500).json({message: "Internal server error"})
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Email and password required" });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const ok = await comparePassword(password, user.password);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });

    const token = signToken({ userId: user.id });
    res.json({ token, user: { id: user.id, email: user.email } });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const me = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const user = await prisma.user.findUnique({ where: { id: userId }, select: { id: true, email: true, createdAt: true } });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ user });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
