"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const teacher_controller_1 = require("./teacher.controller");
const auth_middleware_1 = require("../../common/auth.middleware");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.authMiddleware);
router.get('/', teacher_controller_1.getTeachers);
router.get('/:id', teacher_controller_1.getTeacherById);
router.post('/', teacher_controller_1.createTeacher);
router.patch('/:id', teacher_controller_1.updateTeacher);
router.delete('/:id', teacher_controller_1.deleteTeacher);
exports.default = router;
//# sourceMappingURL=teacher.routes.js.map