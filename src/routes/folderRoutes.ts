// src/routes/folderRoutes.ts
import { Router } from "express";
import {
  createFolder,
  getFolders,
  getFolderById,
  renameFolder,
  deleteFolder
} from "../controllers/folderController";
import { authenticateJWT } from "../middlewares/authMiddleware";

const router = Router();
router.use(authenticateJWT);

router.post("/", createFolder);
router.get("/", getFolders);
router.get("/:id", getFolderById);
router.patch("/:id", renameFolder);
router.delete("/:id", deleteFolder);

export default router;
