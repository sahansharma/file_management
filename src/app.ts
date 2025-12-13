import express, { Express } from "express";  //esModuleInterop
import dotenv from "dotenv";

dotenv.config();

const app: Express = express();
app.use(express.json());

// rate limiting
import limiter from "./middlewares/rateLimit";
app.use(limiter);

//routes
import folderRoutes from "./routes/folderRoutes";
import fileRoutes from "./routes/fileRoutes";
import analyticsRoutes from "./routes/analyticsRoutes";
import authRoutes from "./routes/authRoutes";

app.use("/api/folders", folderRoutes);
app.use("/api/files", fileRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/auth", authRoutes);

export default app;
