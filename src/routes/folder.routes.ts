// src/routes/folderRoutes.ts
import { Router } from "express";
import {
  createFolder,
  getFolders,
  getFolderById,
  renameFolder,
  deleteFolder
} from "../controllers/folder.controller";
import { authenticateJWT } from "../middlewares/auth.middleware";
import { validateZod } from "../middlewares/validateZod.middleware";
import { createFolderSchema, renameFolderSchema, folderIdParamSchema } from "../validations/folder.validation";

const router = Router();
router.use(authenticateJWT);

router.post("/", validateZod(createFolderSchema, "body"), createFolder);
router.get("/", getFolders);
router.get("/:id", validateZod(folderIdParamSchema, "params"), getFolderById);
router.patch(
  "/:id",
  validateZod(folderIdParamSchema, "params"),
  validateZod(renameFolderSchema, "body"),
  renameFolder
);
router.delete("/:id", validateZod(folderIdParamSchema, "params"), deleteFolder);

export default router;
