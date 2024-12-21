import { Router } from 'express';
import { ReferenceController } from './reference.controller';

const router = Router();

router.get('/categories', ReferenceController.getCategories);
router.get('/statuses', ReferenceController.getStatuses);

export default router;
