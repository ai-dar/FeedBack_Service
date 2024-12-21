import { Response } from 'express';
import { AuthRequest } from '../../middlewares/auth';
import { prisma } from '../../db/prisma';

export class VoteController {
    static async upvote(req: AuthRequest, res: Response) {
        try {
          if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized' });
          }
    
          const feedbackId = Number(req.params.feedbackId); 
          if (isNaN(feedbackId)) {
            return res.status(400).json({ message: 'Invalid feedback ID' });
          }
    
          const feedback = await prisma.feedback.findUnique({ where: { id: feedbackId } });
          if (!feedback) {
            return res.status(404).json({ message: 'Feedback not found' });
          }
    
          const existingVote = await prisma.vote.findFirst({
            where: {
              userId: req.user.id,
              feedbackId,
            },
          });
    
          if (existingVote) {
            return res.status(400).json({ message: 'Already voted' });
          }
    
          const vote = await prisma.vote.create({
            data: {
              userId: req.user.id,
              feedbackId,
            },
          });
    
          return res.json({ message: 'Vote successfully registered', vote });
        } catch (error) {
          console.error('Error registering vote:', error);
          return res.status(500).json({ message: 'Server error' });
        }
      }
}
