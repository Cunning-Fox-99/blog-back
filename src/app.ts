import express, { Application, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import postRoutes from "./routes/postRoutes";
import commentRoutes from "./routes/commentRoutes"

dotenv.config();

const app = express(); // Инициализируем express приложение
const PORT = process.env.PORT || 3000;
app.use(cors({
    origin: '*', // Разрешите ваш фронтенд, замените при необходимости
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Разрешенные методы
    allowedHeaders: ['Content-Type', 'Authorization'], // Разрешенные заголовки
}));

// Middleware для обработки JSON
app.use(express.json());

// Основной маршрут для проверки работы сервера
app.get('/', (req: Request, res: Response): void => {
    res.send('Hello, blog with TypeORM and PostgresSQL!');
});

// Подключение маршрутов аутентификации
app.use('/auth', authRoutes);
app.use('/api', userRoutes);
app.use('/api', postRoutes);
app.use('/api', commentRoutes);

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});
