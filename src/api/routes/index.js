import express from 'express';
import AuthAppRoutes from './authApp/authApp.routes';
import mediaRoutes from './media/media.routes';
import authRoutes from './auth/auth.routes';

const router = express.Router();

// Authenticate App
router.use('/api/authapp', AuthAppRoutes);

router.use('/api/media', mediaRoutes);

router.use('/api/auth', authRoutes);

export default router;
