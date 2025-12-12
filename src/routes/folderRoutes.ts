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

router.post("/", authenticateJWT, createFolder);
router.get("/", authenticateJWT, getFolders);
router.get("/:id", authenticateJWT, getFolderById);
router.patch("/:id", authenticateJWT, renameFolder);
router.delete("/:id", authenticateJWT, deleteFolder);

export default router;
