"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const class_controller_1 = require("./class.controller");
const auth_middleware_1 = require("../../common/auth.middleware");
const router = (0, express_1.Router)();
// School routes (no auth needed for initial setup)
router.post('/schools', class_controller_1.createSchool);
router.get('/schools', class_controller_1.getSchools);
// Everything below needs auth
router.use(auth_middleware_1.authMiddleware);
// Classes
router.get('/classes', class_controller_1.getClasses);
router.post('/classes', class_controller_1.createClass);
router.patch('/classes/:id', class_controller_1.updateClass);
router.delete('/classes/:id', class_controller_1.deleteClass);
// Sections
router.get('/sections', class_controller_1.getSections);
router.post('/sections', class_controller_1.createSection);
router.delete('/sections/:id', class_controller_1.deleteSection);
// Subjects
router.get('/subjects', class_controller_1.getSubjects);
router.post('/subjects', class_controller_1.createSubject);
router.delete('/subjects/:id', class_controller_1.deleteSubject);
// Enrollments
router.post('/enrollments', class_controller_1.createEnrollment);
exports.default = router;
//# sourceMappingURL=class.routes.js.map