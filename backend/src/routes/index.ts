import { Router } from 'express';
import { getHelloWorld } from '../controllers/index.js';

const router = Router();

// Hello World route
router.get('/', getHelloWorld);

export default router;
