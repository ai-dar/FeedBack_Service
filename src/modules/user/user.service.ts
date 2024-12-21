import { prisma } from '../../db/prisma';

export class UserService {
  static async getUserById(id: number) {
    return await prisma.user.findUnique({ where: { id } });
  }
}
