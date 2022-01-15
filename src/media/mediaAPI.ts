import "reflect-metadata";
import express from "express";
import authenticateUser from "../auth/authenticateUser";
import { StreamLinksValidation } from "./mediaValidations";
import { play, streamLinks } from "./mediaController";

const router = express.Router();

/* Get stream links for a title */
router.post(
  "/stream-links",
  authenticateUser,
  StreamLinksValidation,
  authenticateUser,
  streamLinks
);

/* Stream video file */
router.get("/play/:name", play);

export default router;
