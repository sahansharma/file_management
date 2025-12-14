// src/controllers/folderController.ts
import { Response, NextFunction } from "express";
import prisma from "../prisma/client";
import { AuthRequest } from "../middlewares/authMiddleware";
import { ResponseHandler } from "../utils/responses/responseHandler";
import { ApiError } from "../utils/errors/apiError";

// Create a new folder
export const createFolder = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { name } = req.body;
    if (!name) throw new ApiError("Folder name is required", 400);

    const folder = await prisma.folder.create({
      data: {
        name,
        userId: req.user!.id
      }
    });

    ResponseHandler.success(res, folder, "Folder created successfully");
  } catch (err) {
    console.error("Create folder error:", err);
    next(err);
  }
};

// List all folders for a user
export const getFolders = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const folders = await prisma.folder.findMany({
      where: { userId: req.user!.id },
      include: { files: true }
    });

    ResponseHandler.success(res, folders, "Folders fetched successfully");
  } catch (err) {
    console.error("Get folders error:", err);
    next(err);
  }
};

// Get a specific folder
export const getFolderById = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    const folder = await prisma.folder.findFirst({
      where: { id, userId: req.user!.id },
      include: { files: true }
    });

    if (!folder) throw new ApiError("Folder not found", 404);

    ResponseHandler.success(res, folder, "Folder fetched successfully");
  } catch (err) {
    console.error("Get folder error:", err);
    next(err);
  }
};

// Rename a folder
export const renameFolder = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    const { name } = req.body;

    if (!name) throw new ApiError("New name is required", 400);

    const folder = await prisma.folder.updateMany({
      where: { id, userId: req.user!.id },
      data: { name }
    });

    if (folder.count === 0) throw new ApiError("Folder not found or unauthorized", 404);

    ResponseHandler.success(res, null, "Folder renamed successfully");
  } catch (err) {
    console.error("Rename folder error:", err);
    next(err);
  }
};

// Delete a folder (cascade)
export const deleteFolder = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);

    // Delete files inside
    await prisma.file.deleteMany({
      where: { folderId: id, userId: req.user!.id }
    });

    // Delete the folder
    const folder = await prisma.folder.deleteMany({
      where: { id, userId: req.user!.id }
    });

    if (folder.count === 0) throw new ApiError("Folder not found or unauthorized", 404);

    ResponseHandler.success(res, null, "Folder deleted successfully");
  } catch (err) {
    console.error("Delete folder error:", err);
    next(err);
  }
};
