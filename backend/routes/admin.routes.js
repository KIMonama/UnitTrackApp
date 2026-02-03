import express from "express"

const router = express.Router();

import { createNewAdminUser } from "../controllers/admins.controller.js";

router.put("/", createNewAdminUser );

export default router;
