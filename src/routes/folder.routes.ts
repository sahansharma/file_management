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
import { validate } from "../middlewares/validate";
import { createFolderSchema, renameFolderSchema, folderIdParamSchema } from "../validations/folder.validation";

const router = Router();
router.use(authenticateJWT);

router.post("/", validate(createFolderSchema, "body"), createFolder);
router.get("/", getFolders);
router.get("/:id", validate(folderIdParamSchema, "params"), getFolderById);
router.patch(
  "/:id",
  validate(folderIdParamSchema, "params"),
  validate(renameFolderSchema, "body"),
  renameFolder
);
router.delete("/:id", validate(folderIdParamSchema, "params"), deleteFolder);

export default router;
