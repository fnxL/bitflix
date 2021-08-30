const express = require('express');
const router = express.Router();
const { authApp, authCallback } = require('../controllers/StreamController');
const streamRoutes = require('./stream');

router.use('/api/stream', streamRoutes);

router.get('/authenticate', authApp);

//call back url
router.get('/', authCallback);
module.exports = router;
