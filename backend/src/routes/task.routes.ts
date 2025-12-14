import { Router } from 'express';
import { taskController } from '../controllers/task.controller.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

// All task routes require authentication
router.use(authMiddleware);

// Task routes
router.get('/', taskController.getAllTasks);
router.get('/:id', taskController.getTaskById);
router.post('/', taskController.createTask);
router.put('/:id', taskController.updateTask);
router.delete('/:id', taskController.deleteTask);

export default router;
