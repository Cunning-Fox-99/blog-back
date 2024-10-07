import { Router } from 'express';
import { getUserProfile, updateUserProfile, deleteUserProfile, getUserById } from '../controllers/userController';
import {authMiddleware} from "../middleware/authMiddleware";

const router = Router();

router.get('/me', authMiddleware, getUserProfile); // Получение профиля текущего пользователя
router.put('/me', authMiddleware, updateUserProfile); // Обновление профиля текущего пользователя
router.delete('/me', authMiddleware, deleteUserProfile); // Удаление профиля текущего пользователя
router.get('/user/:userId', getUserById); // Получение другого пользователя по ID

export default router;
