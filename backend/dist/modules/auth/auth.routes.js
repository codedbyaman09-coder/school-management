"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("./auth.controller");
const auth_middleware_1 = require("../../common/auth.middleware");
const router = (0, express_1.Router)();
router.post('/login', auth_controller_1.login);
router.post('/register', auth_controller_1.register);
router.get('/me', auth_middleware_1.authMiddleware, auth_controller_1.getMe);
exports.default = router;
//# sourceMappingURL=auth.routes.js.map