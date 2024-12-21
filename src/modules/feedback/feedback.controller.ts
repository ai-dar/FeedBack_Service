import { Request, Response } from 'express';
import { prisma } from '../../db/prisma';
import { AuthRequest } from '../../middlewares/auth';

export class FeedbackController {
    static async create(req: AuthRequest, res: Response) {
        if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
        const { title, description, category, status } = req.body;
        const feedback = await prisma.feedback.create({
            data: {
                title,
                description,
                category,
                status,
                authorId: req.user.id
            }
        });
        return res.json(feedback);
    }

    static async update(req: AuthRequest, res: Response) {
        try {
          if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized' });
          }
    
          const id = Number(req.params.id); // Преобразование id в число
          if (isNaN(id)) {
            return res.status(400).json({ message: 'Invalid feedback ID' });
          }
    
          const { title, description, category, status } = req.body;
    
          const feedback = await prisma.feedback.findUnique({ where: { id } });
          if (!feedback) {
            return res.status(404).json({ message: 'Feedback not found' });
          }
    
          if (feedback.authorId !== req.user.id) {
            return res.status(403).json({ message: 'Forbidden' });
          }
    
          const updatedFeedback = await prisma.feedback.update({
            where: { id },
            data: { title, description, category, status },
          });
    
          return res.json(updatedFeedback);
        } catch (error) {
          console.error('Error updating feedback:', error);
          return res.status(500).json({ message: 'Server error' });
        }
      }

    static async delete(req: AuthRequest, res: Response) {
        if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
        const { id } = req.params;
        const feedback = await prisma.feedback.findUnique({ where: { id: Number(id) } });
        if (!feedback) return res.status(404).json({ message: 'Not found' });
        if (feedback.authorId !== req.user.id) return res.status(403).json({ message: 'Forbidden' });

        await prisma.feedback.delete({ where: { id: Number(id) } });
        return res.json({ message: 'Deleted' });
    }

    static async getOne(req: Request, res: Response) {
        const { id } = req.params;
        const feedback = await prisma.feedback.findUnique({
            where: { id: Number(id) },
            include: { votes: true }
        });
        if (!feedback) return res.status(404).json({ message: 'Not found' });

        return res.json({
            ...feedback,
            votesCount: feedback.votes.length
        });
    }

    static async getAll(req: Request, res: Response) {
        const { category, status, sortBy = 'createdAt', order = 'desc', page = '1', perPage = '10' } = req.query;

        const pageNum = Number(page) || 1;
        const perPageNum = Number(perPage) || 10;

        const where: any = {};

        if (category) where.category = category;
        if (status) where.status = status;

        const feedbacks = await prisma.feedback.findMany({
            where,
            include: { votes: true },
            skip: (pageNum - 1) * perPageNum,
            take: perPageNum,
            orderBy: {
                [sortBy as string]: order === 'asc' ? 'asc' : 'desc'
            }
        });

        // Дополнительная сортировка по количеству голосов, если требуется:
        // Если нужно сортировать по количеству голосов, замените sortBy на votesCount
        // Тогда после получения feedbacks отсортируем их вручную:
        if (sortBy === 'votesCount') {
            feedbacks.sort((a, b) => {
                const diff = a.votes.length - b.votes.length;
                return order === 'asc' ? diff : -diff;
            });
        }

        const total = await prisma.feedback.count({ where });

        res.json({
            data: feedbacks.map(f => ({
                ...f,
                votesCount: f.votes.length
            })),
            pagination: {
                total,
                page: pageNum,
                perPage: perPageNum,
                totalPages: Math.ceil(total / perPageNum)
            }
        });
    }
}
