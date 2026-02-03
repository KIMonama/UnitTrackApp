import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.routes.js";
import reportRoutes from "./routes/report.routes.js";
import adminRoutes from "./routes/admin.routes.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/reports", reportRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admins", adminRoutes);


export default app;
