import { Response } from "express";
import { AuthRequest } from "../middlewares/authMiddleware";
import prisma from "../prisma/client";

export const getUsage = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const files = await prisma.file.findMany({ where: { userId } });
    const totalFiles = files.length;
    const totalStorage = files.reduce((acc, f) => acc + Number(f.size), 0);

    res.json({ totalFiles, totalStorage });
  } catch (err) {
    console.error("Analytics error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

