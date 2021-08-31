const express = require('express');

const router = express.Router();

const validateAppRoutes = require('./api/validateAppRoutes');
const mediaRoutes = require('./api/mediaRoutes');

// Validate app
router.use('/api/validateapp', validateAppRoutes);

router.use('/api/media', mediaRoutes);

module.exports = router;
