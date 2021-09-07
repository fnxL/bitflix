const express = require('express');
const asyncHandler = require('express-async-handler');

const router = express.Router();
const { videoplayback, retreiveStreamLinks } = require('./media.controller');

/*
 ** GET /api/media/videoplayback/fileName.mp4?id=id
 ** @desc     stream videos
 ** @params   fileName, id
 */
router.get(
  '/videoplayback/:name',

  asyncHandler(videoplayback)
);

/*
 * GET /api/media/streamlinks?fileName
 * @desc     generate stream links
 * @param   fileName, duration (in ms), type (movie/show), pageSize = 100
 */
router.get('/streamlinks', asyncHandler(retreiveStreamLinks));

module.exports = router;
