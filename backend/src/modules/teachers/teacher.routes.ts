import { Router } from 'express';
import { getTeachers, getTeacherById, createTeacher, updateTeacher, deleteTeacher } from './teacher.controller';
import { authMiddleware } from '../../common/auth.middleware';

const router = Router();

router.use(authMiddleware);
router.get('/', getTeachers);
router.get('/:id', getTeacherById);
router.post('/', createTeacher);
router.patch('/:id', updateTeacher);
router.delete('/:id', deleteTeacher);

export default router;
