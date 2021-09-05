const express = require('express');
const setEtag = require('../../middleware/etag');

const router = express.Router();
const {
  videoplayback,
  retreiveStreamLinks,
} = require('../../controllers/streamController');

/*
 ** GET /api/media/videoplayback/fileName.mp4?id=id
 ** @desc     stream videos
 ** @params   fileName, id
 */
router.get('/videoplayback/:name', setEtag.setEtag, videoplayback);

/*
 ** GET /api/media/streamlinks?fileName
 ** @desc     generate stream links
 ** @params   fileName, duration (in ms), type (movie/show), pageSize = 100
 */
router.get('/streamlinks', retreiveStreamLinks);

module.exports = router;
