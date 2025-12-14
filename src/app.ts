import express, { Express } from "express";  //esModuleInterop
import limiter from "./middlewares/rateLimit.middleware";
import { errorMiddleware } from "./middlewares/error.middleware";
import dotenv from "dotenv";

dotenv.config();

const app: Express = express();
app.use(express.json());

// rate limiting
app.use(limiter);
app.use(errorMiddleware);

//routes
import folderRoutes from "./routes/folder.routes";
import fileRoutes from "./routes/file.routes";
import analyticsRoutes from "./routes/analytics.routes";
import authRoutes from "./routes/auth.routes";

app.use("/api/folders", folderRoutes);
app.use("/api/files", fileRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/auth", authRoutes);

export default app;
