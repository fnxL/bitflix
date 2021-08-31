const express = require('express');

const router = express.Router();
const { download } = require('../../controllers/streamController');

router.get('/download', download);

module.exports = router;
