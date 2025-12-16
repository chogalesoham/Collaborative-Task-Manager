import { Router, Request, Response } from 'express';
import { authController } from './auth.controller.js';
import { authMiddleware } from '../../middleware/auth.js';

const router = Router();

router.post('/register', (req: Request, res: Response) => authController.register(req, res));
router.post('/login', (req: Request, res: Response) => authController.login(req, res));
router.post('/logout', (req: Request, res: Response) => authController.logout(req, res));

router.get('/me', authMiddleware, (req: Request, res: Response) => authController.me(req, res));
router.put('/profile', authMiddleware, (req: Request, res: Response) => authController.updateProfile(req, res));

export default router;
