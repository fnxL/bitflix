import "reflect-metadata";
import express, { Request, Response } from "express";
import { Container } from "typedi";
import GDriveService from "./oauthService";
import { ApiError } from "../utils/ApiError";

const router = express.Router();
const gdriveService = Container.get(GDriveService);

/**
 * Authorization URL for authenticating the app with a google account
 *
 */
router.get("/url", async (req: Request, res: Response) => {
  const url = await gdriveService.generateAuthUrl();
  res.json({
    status: "success",
    url,
  });
});

/**
 * Callback endpoint after validating the app using google account
 * @param {string} code - code received after authorization
 */
router.get("/callback", async (req: Request, res: Response) => {
  if (req.query.code) {
    const tokens = await gdriveService.getTokens(req.query.code as string);
    res.json({
      status: "success",
      data: tokens,
    });
  } else throw new ApiError(400, "No code provided for token exchange");
});

export default router;
