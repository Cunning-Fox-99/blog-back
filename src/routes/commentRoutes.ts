import { Router } from 'express';
import { createComment, updateComment, deleteComment } from '../controllers/commentControllers';
import { authMiddleware } from '../middleware/authMiddleware'; // Предположим, у вас есть middleware для проверки токена

const router = Router();

// Создание комментария (доступно только авторизованным пользователям)
router.post('/post/comment/create', authMiddleware, createComment);
router.put('/post/comment/:commentId', authMiddleware, updateComment);
router.delete('/post/comment/:commentId', authMiddleware, deleteComment);

export default router;
