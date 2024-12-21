import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';

export interface AuthRequest extends Request {
    user?: { id: number; email: string };
}

export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ message: 'No token provided' });
    }

    const [, token] = authHeader.split(' ');
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        const decoded = verifyToken(token) as { id: number; email: string };
        req.user = decoded;
        return next();
    } catch (e) {
        return res.status(401).json({ message: 'Invalid token' });
    }
}
