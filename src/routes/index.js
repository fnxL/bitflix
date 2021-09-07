const express = require('express');

const router = express.Router();

const validateAppRoutes = require('./validateapp/validateapp.routes');
const mediaRoutes = require('./media/media.routes');

// Validate app
router.use('/api/validateapp', validateAppRoutes);

router.use('/api/media', mediaRoutes);

module.exports = router;
