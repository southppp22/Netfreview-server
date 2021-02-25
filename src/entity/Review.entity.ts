import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Like } from './Like.entity';
import { User } from './User.entity';
import { Video } from './Video.entity';

@Entity()
export class Review {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  rating: number;

  @Column()
  text: string;

  @OneToOne(() => Like, (like) => like.review)
  like: Like;

  @ManyToOne(() => User, (user) => user.reviews)
  user: User;

  @ManyToOne(() => Video, (video) => video.reviews)
  video: Video;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
