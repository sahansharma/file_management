import { Router } from "express";
import { register, login, me } from "../controllers/auth.controller";
import { authenticateJWT } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate";
import { registerSchema, loginSchema } from "../validations/auth.validations";

const router = Router();

router.post("/register", validate(registerSchema, "body"), register);
router.post("/login", validate(loginSchema, "body"), login);
router.get("/me", authenticateJWT, me);

export default router;
