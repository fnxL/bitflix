const express = require('express');
const { getAuthUrl, handleCallback } = require('../../controllers/validateAppController');

const router = express.Router();

/*
 ** GET /api/validateapp/authurl
 ** @desc     generateAuthUrl for appAuthentication
 ** @params   None
 */
router.get('/authurl', getAuthUrl);

/*
 ** GET /api/validateapp/callback
 ** @desc     callback url after validating
 ** @params   code, scope
 */
router.get('/callback', handleCallback);

module.exports = router;
