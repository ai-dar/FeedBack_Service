import { prisma } from '../../db/prisma';
import bcrypt from 'bcrypt';
import { signToken } from '../../utils/jwt';

interface RegisterData {
  email: string;
  password: string;
  avatar?: string;
}

interface LoginData {
  email: string;
  password: string;
}

export class AuthService {
  static async register(data: RegisterData) {
    const { email, password, avatar } = data;
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) throw new Error('User already exists');

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { email, password: hashedPassword, avatar }
    });

    const token = signToken({ id: user.id, email: user.email });
    return { user, token };
  }

  static async login(data: LoginData) {
    const { email, password } = data;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error('Invalid credentials');

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new Error('Invalid credentials');

    const token = signToken({ id: user.id, email: user.email });
    return { user, token };
  }
}
