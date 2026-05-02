import { Router } from 'express';
import { login, register, getMe } from './auth.controller';
import { authMiddleware } from '../../common/auth.middleware';

const router = Router();

router.post('/login', login);
router.post('/register', register);
router.get('/me', authMiddleware, getMe);

export default router;
