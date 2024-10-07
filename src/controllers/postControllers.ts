import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { Post } from '../models/Post';
import {User} from "../models/User";
import {Comment} from "../models/Comment";
import {AuthenticatedRequest} from "../middleware/authMiddleware";

// Получение всех постов
export const getAllPosts = async (req: Request, res: Response): Promise<void> => {
    try {
        const postRepository = AppDataSource.getRepository(Post);
        const posts = await postRepository.find({ relations: ['comments'] });
        res.status(200).json(posts); // Отправляем ответ
    } catch (error) {
        res.status(500).json({ message: 'Ошибка получения постов', error });
    }
};

// Получение поста по ID
export const getPost = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const postId = req.params.postId;
        const postRepository = AppDataSource.getRepository(Post);

        const post = await postRepository
            .createQueryBuilder("post")
            .leftJoinAndSelect("post.creator", "creator") // Загружаем создателя поста
            .leftJoinAndSelect("post.comments", "comment")
            .leftJoinAndSelect("comment.creator", "commentCreator") // Загружаем создателя комментария
            .where("post.id = :id", { id: Number(postId) })
            .getOne();

        if (!post) {
            res.status(404).json({ message: 'Пост не найден' });
            return;
        }

        // Увеличиваем количество просмотров
        post.views = (post.views || 0) + 1; // Увеличиваем, учитывая возможное отсутствие значения
        await postRepository.save(post); // Сохраняем изменения

        // Форматируем ответ, чтобы возвращать только id и username
        const formattedComments = post.comments.map(comment => ({
            content: comment.content,
            id: comment.id,
            created_at: comment.createdAt,
            creator: {
                id: comment.creator.id,
                username: comment.creator.username,
            }
        }));

        res.status(200).json({
            createdAt: post.createdAt,
            updatedAt: post.updatedAt,
            title: post.title,
            content: post.content,
            creator: {
                id: post.creator.id, // Теперь создатель поста загружается корректно
                username: post.creator.username,
            },
            views: post.views,
            id: post.id,
            comments: formattedComments,
        }); // Отправляем ответ
    } catch (error:any) {
        console.error("Ошибка получения поста:", error);
        res.status(500).json({ message: 'Ошибка получения поста', error: error.message || error });
    }
};



// Создание поста
export const createPost = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const { title, content } = req.body;
        const userId = req.user?.id;

        if (!userId) {
            res.status(401).json({ message: "Пользователь не авторизован." });
            return;
        }

        const userRepository = AppDataSource.getRepository(User);
        const user = await userRepository.findOneBy({ id: userId });

        if (!user) {
            res.status(404).json({ message: "Пользователь не найден." });
            return;
        }

        const post = new Post(title, content, user);
        const postRepository = AppDataSource.getRepository(Post);
        await postRepository.save(post);

        res.status(201).json(post);
    } catch (error) {
        res.status(500).json({ message: "Ошибка создания поста", error });
    }
};

// Обновление поста
export const updatePost = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const postId = req.params.postId;
        const { title, content } = req.body;
        const postRepository = AppDataSource.getRepository(Post);

        const post = await postRepository.findOne({ where: { id: Number(postId) }, relations: ['creator'] });

        if (!post) {
            res.status(404).json({ message: 'Пост не найден' });
            return;
        }

        // Обновляем поля поста
        post.title = title || post.title; // Если новое значение отсутствует, оставляем старое
        post.content = content || post.content; // То же самое для контента

        await postRepository.save(post); // Сохраняем изменения
        res.status(200).json(post); // Возвращаем обновленный пост
    } catch (error) {
        res.status(500).json({ message: 'Ошибка обновления поста', error });
    }
};

// Удаление поста
export const deletePost = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const postId = req.params.postId;
        const postRepository = AppDataSource.getRepository(Post);
        const commentRepository = AppDataSource.getRepository(Comment);

        // Находим пост
        const post = await postRepository.findOne({ where: { id: Number(postId) } });

        if (!post) {
            res.status(404).json({ message: 'Пост не найден' });
            return;
        }

        // Удаляем все комментарии, связанные с постом
        const comments = await commentRepository.createQueryBuilder("comment")
            .where("comment.postId = :postId", { postId: post.id })
            .getMany();

        if (comments.length > 0) {
            await commentRepository.remove(comments);
        }

        // Теперь удаляем пост
        await postRepository.remove(post);

        res.status(200).json({ message: 'Пост успешно удалён' });
    } catch (error:any) {
        console.error("Ошибка удаления поста:", error);
        res.status(500).json({ message: 'Ошибка удаления поста', error: error.message || error });
    }
};

