import { Router } from 'express';
import { getStudents, getStudentById, createStudent, updateStudent, deleteStudent } from './student.controller';
import { authMiddleware } from '../../common/auth.middleware';

const router = Router();

router.use(authMiddleware);
router.get('/', getStudents);
router.get('/:id', getStudentById);
router.post('/', createStudent);
router.patch('/:id', updateStudent);
router.delete('/:id', deleteStudent);

export default router;
