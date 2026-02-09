import express from "express"

const router = express.Router();

import { createNewAdminUser } from "../controllers/admin.controller.js";

router.put("/", createNewAdminUser );

export default router;
