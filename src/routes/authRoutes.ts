// src/routes/authRoutes.ts
import { Router } from 'express';
import { registerUser, loginUser } from '../controllers/authControllers';

const router = Router();

// Регистрация пользователя
router.post('/register', registerUser);

// Вход пользователя
router.post('/login', loginUser);

export default router;
