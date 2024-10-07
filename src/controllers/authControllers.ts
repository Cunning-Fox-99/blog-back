// src/controllers/authControllers.ts
import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { User } from '../models/User';
import jwt from 'jsonwebtoken';

// Регистрация пользователя
export const registerUser = async (req: Request, res: Response): Promise<void> => {
    const { username, email, password } = req.body;
    console.log(req.body)
    try {
        const userRepository = AppDataSource.getRepository(User);
        console.log(userRepository)
        const existingUser = await userRepository.findOneBy({ email });
        if (existingUser) {
            res.status(400).json({ message: 'Пользователь с таким email уже существует' });
            return;
        }

        const newUser = userRepository.create({ username, email, password });
        await userRepository.save(newUser);
        res.status(201).json({ message: 'Регистрация успешна' });
    } catch (error) {
        res.status(500).json({ message: 'Ошибка регистрации', error });
    }
};

// Вход пользователя
export const loginUser = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;

    try {
        const userRepository = AppDataSource.getRepository(User);
        const user = await userRepository.findOneBy({ email });
        if (!user) {
            res.status(400).json({ message: 'Неправильный email или пароль' });
            return;
        }

        // Здесь должна быть проверка пароля
        const isPasswordValid = await user.validatePassword(password); // Убедитесь, что этот метод существует
        if (!isPasswordValid) {
            res.status(400).json({ message: 'Неправильный email или пароль' });
            return;
        }

        const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET as string, {
            expiresIn: '30d',
        });

        res.json({ token, id: user.id, username: user.username, email: user.email });
    } catch (error) {
        res.status(500).json({ message: 'Ошибка авторизации', error });
    }
};
