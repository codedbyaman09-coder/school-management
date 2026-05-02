import { Router } from 'express';
import { markAttendance, markBulkAttendance, getAttendance, getAttendanceStats } from './attendance.controller';
import { authMiddleware } from '../../common/auth.middleware';

const router = Router();

router.use(authMiddleware);
router.post('/mark', markAttendance);
router.post('/bulk', markBulkAttendance);
router.get('/', getAttendance);
router.get('/stats', getAttendanceStats);

export default router;
