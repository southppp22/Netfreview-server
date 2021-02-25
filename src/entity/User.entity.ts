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
import { Like } from './Like.entity';
import { RefreshToken } from './RefreshToken.entity';
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

  @Column({ default: null })
  profileUrl: string | null;

  @Column({ default: null })
  introduction: string | null;

  @Column()
  nickname: string;

  @Column()
  lastLoginDate: Date;

  @OneToOne(() => Image, (image) => image.user)
  image: Image;

  @OneToOne(() => Like, (like) => like.user)
  like: Like;

  @OneToOne(() => RefreshToken, (refreshToken) => refreshToken.user)
  refreshToken: RefreshToken;

  @OneToMany(() => Review, (review) => review.user)
  reviews: Review[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
