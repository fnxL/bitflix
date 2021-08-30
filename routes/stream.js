const express = require('express');
const router = express.Router();
const { download, getList } = require('../controllers/StreamController');

router.get('/download', download);

router.get('/list', getList);
module.exports = router;
