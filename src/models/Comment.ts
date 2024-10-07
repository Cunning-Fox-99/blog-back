import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { Post } from './Post';
import { User } from './User';

@Entity()
export class Comment {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    content: string;

    @CreateDateColumn()
    createdAt: Date; // Установка значения по умолчанию

    @ManyToOne(() => Post, post => post.comments)
    post!: Post; // Убедитесь, что это поле определено

    @ManyToOne(() => User, user => user.comments)
    creator!: User; // Убедитесь, что это поле определено

    constructor(content: string, post: Post, creator: User) {
        this.content = content;
        this.post = post;
        this.creator = creator;
        this.createdAt = new Date(); // Установка значения по умолчанию
    }
}
