import { Request, Response } from 'express';
import { AuthRequest } from '../../middlewares/auth';
import { prisma } from '../../db/prisma';

export class UserController {
    static async getMe(req: AuthRequest, res: Response) {
        if (!req.user) return res.status(401).json({ message: 'Not authorized' });
        const user = await prisma.user.findUnique({ where: { id: req.user.id } });
        if (!user) return res.status(404).json({ message: 'User not found' });
        return res.json({ id: user.id, email: user.email, avatar: user.avatar });
    }
}
