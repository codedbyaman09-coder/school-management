import { Router } from 'express';
import { getDashboardStats } from './dashboard.controller';
import { authMiddleware } from '../../common/auth.middleware';

const router = Router();

router.get('/stats', authMiddleware, getDashboardStats);

export default router;
