const express = require('express');

const router = express.Router();
const mediaRoutes = require('./api/media');

router.use('/api/media', mediaRoutes);

module.exports = router;
