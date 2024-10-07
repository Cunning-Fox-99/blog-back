// Получение профиля пользователя
import {AuthenticatedRequest} from "../middleware/authMiddleware";
import { Request, Response } from 'express';
import {AppDataSource} from "../data-source";
import {User} from "../models/User";

export const getUserProfile = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id; // Получаем ID пользователя из запроса
        const userRepository = AppDataSource.getRepository(User);

        // Находим пользователя по ID, исключая пароль
        const user = await userRepository.findOne({
            where: { id: userId },
            relations: ['posts'], // Загружаем посты пользователя
        });

        if (!user) {
            res.status(404).json({ message: 'Пользователь не найден' });
            return;
        }

        // Форматируем ответ, исключая пароль
        const { password, ...userProfile } = user;

        res.status(200).json(userProfile);
    } catch (error:any) {
        console.error("Ошибка получения профиля пользователя:", error);
        res.status(500).json({ message: 'Ошибка получения профиля пользователя', error: error.message || error });
    }
};

// Обновление профиля пользователя
export const updateUserProfile = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id; // Получаем ID пользователя из запроса
        const { username, email } = req.body; // Получаем новые данные из запроса
        const userRepository = AppDataSource.getRepository(User);

        // Находим пользователя по ID
        const user = await userRepository.findOne({ where: { id: userId } });

        if (!user) {
            res.status(404).json({ message: 'Пользователь не найден' });
            return;
        }

        // Обновляем данные пользователя
        user.username = username || user.username; // Обновляем, если новое значение предоставлено
        user.email = email || user.email; // Обновляем, если новое значение предоставлено

        await userRepository.save(user);

        res.status(200).json({ message: 'Профиль успешно обновлен', user });
    } catch (error:any) {
        console.error("Ошибка обновления профиля пользователя:", error);
        res.status(500).json({ message: 'Ошибка обновления профиля пользователя', error: error.message || error });
    }
};

// Удаление профиля пользователя
export const deleteUserProfile = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id; // Получаем ID пользователя из запроса
        const userRepository = AppDataSource.getRepository(User);

        // Находим пользователя по ID
        const user = await userRepository.findOne({ where: { id: userId } });

        if (!user) {
            res.status(404).json({ message: 'Пользователь не найден' });
            return;
        }

        // Удаляем пользователя
        await userRepository.remove(user);

        res.status(200).json({ message: 'Профиль успешно удален' });
    } catch (error:any) {
        console.error("Ошибка удаления профиля пользователя:", error);
        res.status(500).json({ message: 'Ошибка удаления профиля пользователя', error: error.message || error });
    }
};

// Получение пользователя по ID
export const getUserById = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.params.userId; // Получаем ID пользователя из параметров
        const userRepository = AppDataSource.getRepository(User);

        // Находим пользователя по ID, включая его посты
        const user = await userRepository.findOne({
            where: { id: Number(userId) },
            relations: ['posts'], // Загружаем посты пользователя
        });

        if (!user) {
            res.status(404).json({ message: 'Пользователь не найден' });
            return;
        }

        // Форматируем ответ, исключая пароль и email
        const { password, email, ...userProfile } = user;

        res.status(200).json(userProfile);
    } catch (error:any) {
        console.error("Ошибка получения пользователя:", error);
        res.status(500).json({ message: 'Ошибка получения пользователя', error: error.message || error });
    }
};
