import multer from "multer";
import path from "path";
import fs from "fs";

// Upload directory
const uploadDir = path.join(__dirname, "../../uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const safeName = path.basename(file.originalname);
    cb(null, Date.now() + "-" + safeName);
  },
});

export const upload = multer({ storage });
