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

const router = Router();

router.use(authenticateJWT);

router.post("/", upload.single("file"), validateFile, uploadFile);
router.get("/", listFiles);
router.get("/:id", downloadFileById);
router.get("/name/:filename", downloadFileByName);
router.patch("/:id", updateFile);
router.delete("/:id", deleteFile);

export default router;
