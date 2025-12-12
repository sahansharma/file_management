import { Router } from "express";
import { authenticateJWT } from "../middlewares/authMiddleware";
import { getUsage } from "../controllers/analyticsController";

const router = Router();

router.get("/usage", authenticateJWT, getUsage);

export default router;
