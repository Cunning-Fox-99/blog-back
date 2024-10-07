import { Router } from 'express';
import {getAllPosts, getPost, createPost, updatePost, deletePost} from '../controllers/postControllers';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

// Получение всех постов
router.get('/posts', getAllPosts);

// Получение конкретного поста по ID
router.get('/posts/:postId', getPost);

// Создание нового поста (только для авторизованных пользователей)
router.post('/posts', authMiddleware, createPost);

router.put('/posts/:postId', authMiddleware, updatePost); // Маршрут для обновления поста
router.delete('/posts/:postId', authMiddleware, deletePost); // Маршрут для удаления поста

export default router;
