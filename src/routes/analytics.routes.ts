import { Router } from "express";
import { authenticateJWT } from "../middlewares/auth.middleware";
import { getUsage } from "../controllers/analytics.controller";

const router = Router();
router.use(authenticateJWT);

router.get("/usage", getUsage);

export default router;