import { Request, Response } from 'express';
import { prisma } from '../../db/prisma';
import { signToken } from '../../utils/jwt';
import bcrypt from 'bcrypt';

export class AuthController {
    static async register(req: Request, res: Response) {
        const { email, password, avatar } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: { email, password: hashedPassword, avatar }
        });

        const token = signToken({ id: user.id, email: user.email });
        return res.json({ token, user: { id: user.id, email: user.email, avatar: user.avatar } });
    }

    static async login(req: Request, res: Response) {
        const { email, password } = req.body;
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return res.status(401).json({ message: 'Invalid credentials' });

        const valid = await bcrypt.compare(password, user.password);
        if (!valid) return res.status(401).json({ message: 'Invalid credentials' });

        const token = signToken({ id: user.id, email: user.email });
        return res.json({ token, user: { id: user.id, email: user.email, avatar: user.avatar } });
    }
}
