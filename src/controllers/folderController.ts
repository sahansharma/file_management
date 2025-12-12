// src/controllers/folderController.ts
import { Response } from "express";
import prisma from "../prisma/client";
import { AuthRequest } from "../middlewares/authMiddleware";

// Create a new folder
export const createFolder = async (req: AuthRequest, res: Response) => {
  try {
    const { name } = req.body;

    if (!name) return res.status(400).json({ message: "Folder name is required" });

    const folder = await prisma.folder.create({
      data: {
        name,
        userId: req.user!.id
      }
    });

    res.status(201).json(folder);
  } catch (err) {
    console.error("Create folder error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// List all folders for a user
export const getFolders = async (req: AuthRequest, res: Response) => {
  try {
    const folders = await prisma.folder.findMany({
      where: { userId: req.user!.id },
      include: { files: true }
    });

    res.json(folders);
  } catch (err) {
    console.error("Get folders error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get a specific folder
export const getFolderById = async (req: AuthRequest, res: Response) => {
  try {
    const id = Number(req.params.id);

    const folder = await prisma.folder.findFirst({
      where: { id, userId: req.user!.id },
      include: { files: true }
    });

    if (!folder) return res.status(404).json({ message: "Folder not found" });

    res.json(folder);
  } catch (err) {
    console.error("Get folder error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Rename a folder
export const renameFolder = async (req: AuthRequest, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { name } = req.body;

    if (!name) return res.status(400).json({ message: "New name is required" });

    const folder = await prisma.folder.updateMany({
      where: { id, userId: req.user!.id },
      data: { name }
    });

    if (folder.count === 0)
      return res.status(404).json({ message: "Folder not found or unauthorized" });

    res.json({ message: "Folder renamed" });
  } catch (err) {
    console.error("Rename folder error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete a folder (cascade)
export const deleteFolder = async (req: AuthRequest, res: Response) => {
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

    if (folder.count === 0)
      return res.status(404).json({ message: "Folder not found or unauthorized" });

    res.json({ message: "Folder deleted" });
  } catch (err) {
    console.error("Delete folder error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
