import express from "express";
import config from "../config/default";
import userRoutes from "./auth/authAPI";
import mediaRoutes from "./media/mediaAPI";

const router = express.Router();

/* Authtentication Routes */
router.use(`${config.api.prefix}/auth`, userRoutes);

/* Media Routes */
router.use(`${config.api.prefix}/media`, mediaRoutes);

export default router;
