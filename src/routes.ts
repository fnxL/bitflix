import express from "express";
import config from "../config/default";
import userRoutes from "./auth/authAPI";
import mediaRoutes from "./media/mediaAPI";
import oauthRoutes from "./gdrive-oauth/oauthAPI";
import subtitlesRoutes from "./subtitles/subtitlesAPI";

const router = express.Router();

/* Authtentication Routes */
router.use(`${config.api.prefix}/auth`, userRoutes);

/* Media Routes */
router.use(`${config.api.prefix}/media`, mediaRoutes);

/* Subtitles Routes */
router.use(`${config.api.prefix}/subtitles`, subtitlesRoutes);

/* GDrive OAuth Routes */
router.use(`${config.api.prefix}/drive/oauth`, oauthRoutes);

export default router;
