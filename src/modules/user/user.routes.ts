import { Router } from 'express';
import { UserController } from './user.controller';
import { authMiddleware } from '../../middlewares/auth';

const router = Router();

router.get('/me', authMiddleware, UserController.getMe);

export default router;
