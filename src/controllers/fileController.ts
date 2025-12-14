import { AuthRequest } from "../middlewares/authMiddleware";
import { Response, NextFunction } from "express";
import prisma from "../prisma/client";
import fs from "fs";
import path from "path";
import { ResponseHandler } from "../utils/responses/responseHandler";
import { ApiError } from "../utils/errors/apiError";

// Upload file
export const uploadFile = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const file = req.file;
    const { folderId } = req.body;

    if (!file) throw new ApiError("File required", 400);

    const dbFile = await prisma.file.create({
      data: {
        filename: file.originalname,
        filepath: file.path,
        size: BigInt(file.size),
        mimeType: file.mimetype,
        userId: req.user!.id,
        folderId: folderId ? Number(folderId) : null,
      },
    });

    ResponseHandler.success(res, dbFile, "File uploaded successfully");
  } catch (err) {
    console.error("Upload file error:", err);
    next(err);
  }
};

// List all files
export const listFiles = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const files = await prisma.file.findMany({
      where: { userId: req.user!.id },
      include: { folder: true },
    });

    ResponseHandler.success(res, files, "Files fetched successfully");
  } catch (err) {
    console.error("List files error:", err);
    next(err);
  }
};

// Download file by ID
export const downloadFileById = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const file = await prisma.file.findFirst({
      where: { id: Number(id), userId: req.user!.id },
    });

    if (!file) throw new ApiError("File not found", 404);

    res.download(path.resolve(file.filepath), file.filename);
  } catch (err) {
    console.error("Download file by ID error:", err);
    next(err);
  }
};

// Download file by filename
export const downloadFileByName = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { filename } = req.params;
    const file = await prisma.file.findFirst({
      where: { filename, userId: req.user!.id },
    });

    if (!file) throw new ApiError("File not found", 404);

    res.download(path.resolve(file.filepath), file.filename);
  } catch (err) {
    console.error("Download file by name error:", err);
    next(err);
  }
};

// Move or rename file
export const updateFile = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { folderId, filename } = req.body;

    const file = await prisma.file.findFirst({
      where: { id: Number(id), userId: req.user!.id },
    });
    if (!file) throw new ApiError("File not found", 404);

    const updated = await prisma.file.update({
      where: { id: file.id },
      data: {
        folderId: folderId ? Number(folderId) : file.folderId,
        filename: filename || file.filename,
      },
    });

    ResponseHandler.success(res, updated, "File updated successfully");
  } catch (err) {
    console.error("Update file error:", err);
    next(err);
  }
};

// Delete file
export const deleteFile = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const file = await prisma.file.findFirst({
      where: { id: Number(id), userId: req.user!.id },
    });
    if (!file) throw new ApiError("File not found", 404);

    fs.unlinkSync(file.filepath);
    await prisma.file.delete({ where: { id: file.id } });

    ResponseHandler.success(res, null, "File deleted successfully");
  } catch (err) {
    console.error("Delete file error:", err);
    next(err);
  }
};
