"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const attendance_controller_1 = require("./attendance.controller");
const auth_middleware_1 = require("../../common/auth.middleware");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.authMiddleware);
router.post('/mark', attendance_controller_1.markAttendance);
router.post('/bulk', attendance_controller_1.markBulkAttendance);
router.get('/', attendance_controller_1.getAttendance);
router.get('/stats', attendance_controller_1.getAttendanceStats);
exports.default = router;
//# sourceMappingURL=attendance.routes.js.map