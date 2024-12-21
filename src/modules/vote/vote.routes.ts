import { Router } from 'express';
import { authMiddleware } from '../../middlewares/auth';
import { VoteController } from './vote.controller';

const router = Router();

router.post('/:feedbackId', authMiddleware, VoteController.upvote);

export default router;
