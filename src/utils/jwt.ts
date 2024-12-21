import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/env';

export function signToken(payload: object): string {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string) {
    return jwt.verify(token, JWT_SECRET);
}
