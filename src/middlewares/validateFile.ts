import { Request, Response, NextFunction } from "express";
import fs from "fs";
import path from "path";

const ALLOWED_MIME = [
  "image/png",
  "image/jpeg",
  "image/gif",
  "application/pdf",
  "text/plain",
];

const MAX_SIZE = Number(process.env.MAX_UPLOAD_BYTES || 10 * 1024 * 1024); // 10MB default

export const validateFile = (req: Request, res: Response, next: NextFunction) => {
  const file = (req as any).file;
  if (!file) return res.status(400).json({ message: "File is required" });

  // basic sanitization: filename should not contain path separators
  if (file.originalname.includes("..") || file.originalname.includes("/") || file.originalname.includes("\\")) {
    // remove uploaded file
    try { fs.unlinkSync(file.path); } catch (e) {}
    return res.status(400).json({ message: "Invalid file name" });
  }

  if (!ALLOWED_MIME.includes(file.mimetype)) {
    try { fs.unlinkSync(file.path); } catch (e) {}
    return res.status(400).json({ message: "Unsupported file type" });
  }

  if (file.size > MAX_SIZE) {
    try { fs.unlinkSync(file.path); } catch (e) {}
    return res.status(400).json({ message: "File too large" });
  }

  // Optional: normalize path to prevent traversal
  file.path = path.resolve(file.path);

  next();
};
