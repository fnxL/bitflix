const express = require('express');

const router = express.Router();
const { videoplayback, retreiveStreamLinks } = require('../../controllers/streamControl');

router.get('/videoplayback', videoplayback);
router.get('/streamlinks', retreiveStreamLinks);

module.exports = router;
