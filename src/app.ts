import express, { Express } from "express";  //esModuleInterop
import limiter from "./middlewares/rateLimit";
import { errorMiddleware } from "./middlewares/errorMiddleware";
import dotenv from "dotenv";

dotenv.config();

const app: Express = express();
app.use(express.json());

// rate limiting
app.use(limiter);
app.use(errorMiddleware);

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
