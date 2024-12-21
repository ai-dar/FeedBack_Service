import { Router } from 'express';
import { FeedbackController } from './feedback.controller';
import { authMiddleware } from '../../middlewares/auth';

const router = Router();

router.post('/', authMiddleware, FeedbackController.create);
router.put('/:id', authMiddleware, FeedbackController.update);
router.delete('/:id', authMiddleware, FeedbackController.delete);
router.get('/:id', FeedbackController.getOne);
router.get('/', FeedbackController.getAll);

export default router;
