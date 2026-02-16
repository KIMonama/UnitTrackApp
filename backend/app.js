import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.routes.js";
import reportRoutes from "./routes/report.routes.js";

import { verifyToken } from "./middleware/auth.middleware.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/reports",verifyToken, reportRoutes);
app.use("/api/auth", authRoutes);



export default app;
