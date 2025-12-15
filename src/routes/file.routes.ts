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
import { validate } from "../middlewares/validate";
import { uploadFileSchema, updateFileSchema, fileIdParamSchema, fileNameParamSchema } from "../validations/file.validation";

const router = Router();

router.use(authenticateJWT);

router.post("/", upload.single("file"), validate(uploadFileSchema, "body"), validateFile, uploadFile);
router.get("/", listFiles);
router.get("/:id", validate(fileIdParamSchema, "params"), downloadFileById);
router.get("/name/:filename", validate(fileNameParamSchema, "params"), downloadFileByName);
router.patch("/:id", validate(fileIdParamSchema, "params"), validate(updateFileSchema, "body"), updateFile);
router.delete("/:id", validate(fileIdParamSchema, "params"), deleteFile);

export default router;
