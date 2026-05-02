"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const exam_controller_1 = require("./exam.controller");
const auth_middleware_1 = require("../../common/auth.middleware");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.authMiddleware);
// Exams
router.get('/', exam_controller_1.getExams);
router.post('/', exam_controller_1.createExam);
router.delete('/:id', exam_controller_1.deleteExam);
// Exam Subjects
router.post('/subjects', exam_controller_1.createExamSubject);
// Marks
router.post('/marks', exam_controller_1.submitMarks);
router.get('/marks', exam_controller_1.getMarks);
router.get('/results/:studentId', exam_controller_1.getStudentResults);
exports.default = router;
//# sourceMappingURL=exam.routes.js.map