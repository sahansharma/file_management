import { Router } from "express";
import { register, login, me } from "../controllers/auth.controller";
import { authenticateJWT } from "../middlewares/auth.middleware";
import { validateZod } from "../middlewares/validateZod.middleware";
import { registerSchema, loginSchema } from "../validations/auth.validations";

const router = Router();

router.post("/register", validateZod(registerSchema, "body"), register);
router.post("/login", validateZod(loginSchema, "body"), login);
router.get("/me", authenticateJWT, me);

export default router;
