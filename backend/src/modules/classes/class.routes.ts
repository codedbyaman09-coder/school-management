import { Router } from 'express';
import {
  createSchool, getSchools,
  getClasses, createClass, updateClass, deleteClass,
  getSections, createSection, deleteSection,
  getSubjects, createSubject, deleteSubject,
  createEnrollment,
} from './class.controller';
import { authMiddleware } from '../../common/auth.middleware';

const router = Router();

// School routes (no auth needed for initial setup)
router.post('/schools', createSchool);
router.get('/schools', getSchools);

// Everything below needs auth
router.use(authMiddleware);

// Classes
router.get('/classes', getClasses);
router.post('/classes', createClass);
router.patch('/classes/:id', updateClass);
router.delete('/classes/:id', deleteClass);

// Sections
router.get('/sections', getSections);
router.post('/sections', createSection);
router.delete('/sections/:id', deleteSection);

// Subjects
router.get('/subjects', getSubjects);
router.post('/subjects', createSubject);
router.delete('/subjects/:id', deleteSubject);

// Enrollments
router.post('/enrollments', createEnrollment);

export default router;
