import { Router } from "express";
import { authenticateJWT } from "../middlewares/authMiddleware";
import { getUsage } from "../controllers/analyticsController";

const router = Router();
router.use(authenticateJWT);

router.get("/usage", getUsage);

export default router;