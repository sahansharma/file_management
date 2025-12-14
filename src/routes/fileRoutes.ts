import { Router } from "express";
import { authenticateJWT } from "../middlewares/authMiddleware";
import {
  uploadFile,
  listFiles,
  downloadFileById,
  downloadFileByName,
  updateFile,
  deleteFile,
} from "../controllers/fileController";
import { upload } from "../middlewares/multerMiddleware";
import { validateFile } from "../middlewares/validateFile";

const router = Router();

router.use(authenticateJWT);

router.post("/", upload.single("file"), validateFile, uploadFile);
router.get("/", listFiles);
router.get("/:id", downloadFileById);
router.get("/name/:filename", downloadFileByName);
router.patch("/:id", updateFile);
router.delete("/:id", deleteFile);

export default router;
