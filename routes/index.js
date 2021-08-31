const express = require('express');

const router = express.Router();
const streamRoutes = require('./api/stream');

router.use('/api/stream', streamRoutes);

module.exports = router;
