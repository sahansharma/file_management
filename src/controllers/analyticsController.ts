import { Response } from "express";
import { AuthRequest } from "../middlewares/authMiddleware";
import prisma from "../prisma/client";
import { ResponseHandler } from "../utils/responses/responseHandler";

export const getUsage = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;

    const analytics = await prisma.file.aggregate({
      where: { userId },
      _count: { id: true },
      _sum: { size: true },
    });

    ResponseHandler.success(res, {
      totalFiles: analytics._count.id,
      totalStorage: Number(analytics._sum.size ?? 0),
    },"Analytics retrieved successfully");
    } catch(err){
      console.error("Analytics error:", err);
    ResponseHandler.error(
      res, "Server error", (err as Error).message, 500
    );
  }
};

