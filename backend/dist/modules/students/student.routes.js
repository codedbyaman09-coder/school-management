"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const student_controller_1 = require("./student.controller");
const auth_middleware_1 = require("../../common/auth.middleware");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.authMiddleware);
router.get('/', student_controller_1.getStudents);
router.get('/:id', student_controller_1.getStudentById);
router.post('/', student_controller_1.createStudent);
router.patch('/:id', student_controller_1.updateStudent);
router.delete('/:id', student_controller_1.deleteStudent);
exports.default = router;
//# sourceMappingURL=student.routes.js.map