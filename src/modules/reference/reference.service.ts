import { Category, Status } from '@prisma/client';

export class ReferenceService {
  static getCategories() {
    return Object.values(Category);
  }

  static getStatuses() {
    return Object.values(Status);
  }
}
