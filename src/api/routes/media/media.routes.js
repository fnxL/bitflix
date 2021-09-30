import express from 'express';
import asyncHandler from '../../middlewares/asyncHandler';
import { getSubtitles, retreiveStreamLinks, videoplayback } from './media.controller';
import requireAuth from '../../middlewares/requireAuth';

const router = express.Router();

/*
 *  GET /api/media/videoplayback/fileName.mp4?id=id
 *  @desc     stream videos
 *  @params   fileName, id
 */
router.get('/videoplayback/:name', requireAuth, asyncHandler(videoplayback));

/*
 *  GET /api/media/streamlinks?fileName
 *  @desc     generate stream links
 *  @param   fileName, duration (in ms), type (movie/show), pageSize = 100
 *  @fileName - <title> <year> <quality> ex: 'Mulan 2020 1080'
 */
router.get('/streamlinks', requireAuth, asyncHandler(retreiveStreamLinks));

router.get('/subtitles', requireAuth, asyncHandler(getSubtitles));

export default router;
