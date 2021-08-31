const express = require('express');

const router = express.Router();
const { videoplayback, retreiveStreamLinks } = require('../../controllers/streamController');

/*
 ** GET /api/media/videoplayback
 ** @desc     stream videos
 ** @params   id
 */
router.get('/videoplayback', videoplayback);

/*
 ** GET /api/media/streamlinks
 ** @desc     generate stream links
 ** @params   fileName
 */
router.get('/streamlinks', retreiveStreamLinks);

module.exports = router;
