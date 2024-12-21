import { prisma } from '../../db/prisma';

export class VoteService {
  static async upvote(feedbackId: number, userId: number) {
    const feedback = await prisma.feedback.findUnique({ where: { id: feedbackId } });
    if (!feedback) throw new Error('Feedback not found');

    const existingVote = await prisma.vote.findFirst({
      where: {
        userId,
        feedbackId
      }
    });
    if (existingVote) throw new Error('Already voted');

    await prisma.vote.create({
      data: {
        userId,
        feedbackId
      }
    });

    return true;
  }
}
