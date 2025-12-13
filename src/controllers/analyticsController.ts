import { Response } from "express";
import { AuthRequest } from "../middlewares/authMiddleware";
import prisma from "../prisma/client";

export const getUsage = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;

    const analytics = await prisma.file.aggregate({
      where: { userId },
      _count: { id: true },
      _sum: { size: true },
    });

    res.json({
      totalFiles: analytics._count.id,
      totalStorage: Number(analytics._sum.size ?? 0),
    });
  } catch (err) {
    console.error("Analytics error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

