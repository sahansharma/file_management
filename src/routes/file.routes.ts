import { Router } from "express";
import { authenticateJWT } from "../middlewares/auth.middleware";
import {
  uploadFile,
  listFiles,
  downloadFileById,
  downloadFileByName,
  updateFile,
  deleteFile,
} from "../controllers/file.controller";
import { upload } from "../middlewares/multer.middleware";
import { validateFile } from "../middlewares/validateFile.middleware";
import { validateZod } from "../middlewares/validateZod.middleware";
import { uploadFileSchema, updateFileSchema, fileIdParamSchema, fileNameParamSchema } from "../validations/file.validation";

const router = Router();

router.use(authenticateJWT);

router.post("/", upload.single("file"), validateZod(uploadFileSchema, "body"), validateFile, uploadFile);
router.get("/", listFiles);
router.get("/:id", validateZod(fileIdParamSchema, "params"), downloadFileById);
router.get("/name/:filename", validateZod(fileNameParamSchema, "params"), downloadFileByName);
router.patch("/:id", validateZod(fileIdParamSchema, "params"), validateZod(updateFileSchema, "body"), updateFile);
router.delete("/:id", validateZod(fileIdParamSchema, "params"), deleteFile);

export default router;
