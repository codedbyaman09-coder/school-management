import { Router } from 'express';
import { getExams, createExam, deleteExam, createExamSubject, submitMarks, getMarks, getStudentResults } from './exam.controller';
import { authMiddleware } from '../../common/auth.middleware';

const router = Router();

router.use(authMiddleware);

// Exams
router.get('/', getExams);
router.post('/', createExam);
router.delete('/:id', deleteExam);

// Exam Subjects
router.post('/subjects', createExamSubject);

// Marks
router.post('/marks', submitMarks);
router.get('/marks', getMarks);
router.get('/results/:studentId', getStudentResults);

export default router;
