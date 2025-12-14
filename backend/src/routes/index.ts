import { Router } from 'express';
import { getHelloWorld } from '../controllers/index.js';
import authRoutes from '../modules/auth/auth.routes.js';

const router = Router();

// Hello World route
router.get('/', getHelloWorld);

// API v1 routes
router.use('/api/v1/auth', authRoutes);

export default router;
