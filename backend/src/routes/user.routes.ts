import { Router } from 'express';
import { userController } from '../controllers/user.controller.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

// All user routes require authentication
router.use(authMiddleware);

// Get all users (for assignee dropdown)
router.get('/', userController.getAllUsers);

export default router;
