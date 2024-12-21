import { prisma } from '../../db/prisma';
import { Feedback, Vote, Category, Status } from '@prisma/client'; // Импорт enum

interface Filters {
  category?: string;
  status?: string;
  sortBy?: string;
  order?: string;
  page?: number;
  perPage?: number;
}


export class FeedbackService {
  static async create(data: {
    title: string;
    description: string;
    category: Category; // Тип должен быть из enum Category
    status: Status; // Тип должен быть из enum Status
    authorId: number;
  }) {
    return await prisma.feedback.create({
      data,
    });
  }

  static async update(id: number, data: any, userId: number) {
    const feedback = await prisma.feedback.findUnique({ where: { id } });
    if (!feedback) throw new Error('Not found');
    if (feedback.authorId !== userId) throw new Error('Forbidden');

    return await prisma.feedback.update({
      where: { id },
      data,
    });
  }

  static async delete(id: number, userId: number) {
    const feedback = await prisma.feedback.findUnique({ where: { id } });
    if (!feedback) throw new Error('Not found');
    if (feedback.authorId !== userId) throw new Error('Forbidden');

    await prisma.feedback.delete({ where: { id } });
    return true;
  }

  static async getOne(id: number) {
    return await prisma.feedback.findUnique({
      where: { id },
      include: { votes: true }, // Включаем связанные голоса
    });
  }

  static async getAll(filters: Filters) {
    const { category, status, sortBy = 'createdAt', order = 'desc', page = 1, perPage = 10 } = filters;
  
    const where: any = {};
    if (category) where.category = category;
    if (status) where.status = status;
  
    const feedbacks = await prisma.feedback.findMany({
      where,
      include: { votes: true },
      skip: (page - 1) * perPage,
      take: perPage,
      orderBy: sortBy !== 'votesCount' ? { [sortBy]: order === 'asc' ? 'asc' : 'desc' } : undefined,
    });
  
    if (sortBy === 'votesCount') {
      feedbacks.sort((a, b) => {
        const votesA = a.votes?.length || 0;
        const votesB = b.votes?.length || 0;
        return order === 'asc' ? votesA - votesB : votesB - votesA;
      });
    }
  
    const total = await prisma.feedback.count({ where });
  
    return {
      data: feedbacks.map((f) => ({
        ...f,
        votesCount: f.votes?.length || 0,
      })),
      pagination: {
        total,
        page,
        perPage,
        totalPages: Math.ceil(total / perPage),
      },
    };
  }
  
}
