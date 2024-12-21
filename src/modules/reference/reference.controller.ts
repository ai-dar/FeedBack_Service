import { Request, Response } from 'express';
import { Category, Status } from '@prisma/client';

export class ReferenceController {
    static async getCategories(req: Request, res: Response) {
        return res.json({ categories: Object.values(Category) });
    }

    static async getStatuses(req: Request, res: Response) {
        return res.json({ statuses: Object.values(Status) });
    }
}
