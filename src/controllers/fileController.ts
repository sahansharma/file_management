import { AuthRequest } from "../middlewares/authMiddleware";
import { Response } from "express";
import prisma from "../prisma/client";
import fs from "fs";
import path from "path";

// Upload file
export const uploadFile = async (req: AuthRequest, res: Response) => {
  const file = req.file;
  const { folderId } = req.body;

  if (!file) return res.status(400).json({ message: "File required" });

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

  res.status(201).json(dbFile);
};

// List all files
export const listFiles = async (req: AuthRequest, res: Response) => {
  const files = await prisma.file.findMany({
    where: { userId: req.user!.id },
    include: { folder: true },
  });
  res.json(files);
};

// Download file by ID
export const downloadFileById = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const file = await prisma.file.findFirst({
    where: { id: Number(id), userId: req.user!.id },
  });
  if (!file) return res.status(404).json({ message: "File not found" });
  res.download(path.resolve(file.filepath), file.filename);
};

// Download file by filename
export const downloadFileByName = async (req: AuthRequest, res: Response) => {
  const { filename } = req.params;
  const file = await prisma.file.findFirst({
    where: { filename, userId: req.user!.id },
  });
  if (!file) return res.status(404).json({ message: "File not found" });
  res.download(path.resolve(file.filepath), file.filename);
};

// Move or rename file
export const updateFile = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { folderId, filename } = req.body;

  const file = await prisma.file.findFirst({
    where: { id: Number(id), userId: req.user!.id },
  });
  if (!file) return res.status(404).json({ message: "File not found" });

  const updated = await prisma.file.update({
    where: { id: file.id },
    data: {
      folderId: folderId ? Number(folderId) : file.folderId,
      filename: filename || file.filename,
    },
  });

  res.json(updated);
};

// Delete file
export const deleteFile = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const file = await prisma.file.findFirst({
    where: { id: Number(id), userId: req.user!.id },
  });
  if (!file) return res.status(404).json({ message: "File not found" });

  fs.unlinkSync(file.filepath);
  await prisma.file.delete({ where: { id: file.id } });

  res.json({ message: "File deleted" });
};
