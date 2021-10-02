import express from 'express';
import { getAuthUrl, handleCallback } from './authApp.controller';

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

export default router;
