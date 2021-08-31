const express = require('express');

const router = express.Router();
const { download } = require('../../controllers/streamControl');

router.get('/download', download);

module.exports = router;
