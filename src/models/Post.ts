import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { User } from './User';
import { Comment } from './Comment';

@Entity()
export class Post {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    title: string;

    @Column()
    content: string;

    @Column({ default: 0 }) // Начальное значение для просмотров
    views: number;

    @ManyToOne(() => User, user => user.posts)
    creator!: User;

    @OneToMany(() => Comment, comment => comment.post, { cascade: true })
    comments!: Comment[]; // Убедитесь, что это поле определено

    @CreateDateColumn()
    createdAt: Date; // Установка значения по умолчанию

    @UpdateDateColumn()
    updatedAt: Date; // Установка значения по умолчанию

    constructor(title: string, content: string, creator: User) {
        this.title = title;
        this.content = content;
        this.creator = creator;
        this.views = 0; // Устанавливаем начальное значение для просмотров
        this.createdAt = new Date(); // Установка значения по умолчанию
        this.updatedAt = new Date(); // Установка значения по умолчанию
    }
}
