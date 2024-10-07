import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { Comment } from '../models/Comment';
import { Post } from '../models/Post';
import { User } from '../models/User';
import { AuthenticatedRequest } from "../middleware/authMiddleware";

// Контроллер для создания комментария
export const createComment = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const { content, postId } = req.body;
        const userId = req.user?.id;

        const userRepository = AppDataSource.getRepository(User);
        const user = await userRepository.findOneBy({ id: userId });
        const postRepository = AppDataSource.getRepository(Post);
        const post = await postRepository.findOneBy({ id: postId });

        if (!user) {
            res.status(404).json({ message: "Пользователь не найден." });
            return;
        }

        if (!post) {
            res.status(404).json({ message: "Пост не найден." });
            return;
        }

        const comment = new Comment(content, post, user);
        comment.post = post;
        comment.creator = user;

        const commentRepository = AppDataSource.getRepository(Comment);
        await commentRepository.save(comment);

        res.status(201).json({
            id: comment.id,
            content: comment.content,
            creator: {
                id: user.id,
                username: user.username,
            },
        });
    } catch (error) {
        res.status(500).json({ message: "Ошибка создания комментария", error });
    }
};

export const deleteComment = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const commentId = req.params.commentId;
        const userId = req.user?.id; // Получаем ID пользователя из запроса
        const commentRepository = AppDataSource.getRepository(Comment);

        // Находим комментарий по ID
        const comment = await commentRepository.findOne({
            where: { id: Number(commentId) },
            relations: ['creator'] // Загружаем создателя комментария для проверки владельца
        });

        if (!comment) {
            res.status(404).json({ message: 'Комментарий не найден' });
            return;
        }

        // Проверяем, является ли пользователь владельцем комментария
        if (comment.creator.id !== userId) {
            res.status(403).json({ message: 'У вас нет прав для удаления этого комментария' });
            return;
        }

        // Удаляем комментарий
        await commentRepository.remove(comment);

        res.status(200).json({ message: 'Комментарий успешно удален' });
    } catch (error:any) {
        console.error("Ошибка удаления комментария:", error);
        res.status(500).json({ message: 'Ошибка удаления комментария', error: error.message || error });
    }
};

export const updateComment = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const commentId = req.params.commentId;
        const { content } = req.body; // Получаем новое содержание комментария
        const userId = req.user?.id; // Получаем ID пользователя из запроса
        const commentRepository = AppDataSource.getRepository(Comment);

        // Находим комментарий по ID
        const comment = await commentRepository.findOne({
            where: { id: Number(commentId) },
            relations: ['creator'] // Загружаем создателя комментария для проверки владельца
        });

        if (!comment) {
            res.status(404).json({ message: 'Комментарий не найден' });
            return;
        }

        // Проверяем, является ли пользователь владельцем комментария
        if (comment.creator.id !== userId) {
            res.status(403).json({ message: 'У вас нет прав для обновления этого комментария' });
            return;
        }

        // Обновляем содержание комментария
        comment.content = content;
        await commentRepository.save(comment);

        res.status(200).json({ message: 'Комментарий успешно обновлен', comment });
    } catch (error:any) {
        console.error("Ошибка обновления комментария:", error);
        res.status(500).json({ message: 'Ошибка обновления комментария', error: error.message || error });
    }
};
