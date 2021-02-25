import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Image } from './Image.entity';
import { LikeReview } from './LikeReview.entity';
import { Review } from './Review.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  email: string;

  @Column()
  name: string;

  @Column()
  password: string;

  @Column({ default: '' })
  profileUrl: string;

  @Column({ default: '' })
  introduction: string;

  @Column()
  nickname: string;

  @OneToOne(() => Image, (image) => image.user)
  image: Image;

  @OneToOne(() => LikeReview, (like) => like.user)
  likeReview: LikeReview;

  @OneToMany(() => Review, (review) => review.user)
  reviews: Review[];

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updatedAt: string;
}
