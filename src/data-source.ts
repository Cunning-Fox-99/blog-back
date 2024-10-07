import { DataSource } from 'typeorm';
import dotenv from 'dotenv';
import { User } from './models/User';
import {Post} from "./models/Post"; // Импортируйте свою сущность
import {Comment} from "./models/Comment"; // Импортируйте свою сущность

dotenv.config();

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [User, Post, Comment],  // Указываем массив с сущностями
    synchronize: true,
});

AppDataSource.initialize()
    .then(() => {
        console.log("Data Source has been initialized!");
    })
    .catch((err) => {
        console.error("Error during Data Source initialization:", err);
    });
