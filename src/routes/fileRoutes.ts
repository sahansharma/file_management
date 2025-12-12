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

router.post("/", authenticateJWT, upload.single("file"), validateFile, uploadFile);
router.get("/", authenticateJWT, listFiles);
router.get("/:id", authenticateJWT, downloadFileById);
router.get("/name/:filename", authenticateJWT, downloadFileByName);
router.patch("/:id", authenticateJWT, updateFile);
router.delete("/:id", authenticateJWT, deleteFile);

export default router;
