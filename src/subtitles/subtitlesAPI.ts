import "reflect-metadata";
import express, { Request, Response } from "express";
import { Container } from "typedi";
import SubtitlesService from "./subtitlesService";
import { OpenSubtitles } from "../interfaces/Subtitles/OpenSubtitles";
import { subtitleValidations } from "./subtitlesValidations";

const router = express.Router();
const subtitlesService = Container.get(SubtitlesService);

router.post("/", subtitleValidations, async (req: Request, res: Response) => {
  const data = req.body as OpenSubtitles;
  const subs = await subtitlesService.getSubtitles(data);
  res.json(subs);
});

export default router;
