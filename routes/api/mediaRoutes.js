const express = require('express');

const router = express.Router();
const { videoplayback, retreiveStreamLinks } = require('../../controllers/streamController');

/*
 ** GET /api/media/videoplayback/fileName.mp4?id=id
 ** @desc     stream videos
 ** @params   fileName, id
 */
router.get('/videoplayback/:name', videoplayback);

/*
 ** GET /api/media/streamlinks?fileName
 ** @desc     generate stream links
 ** @params   fileName
 */
router.get('/streamlinks', retreiveStreamLinks);

module.exports = router;
