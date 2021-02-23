import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Genre } from './Genre.entity';
import { Review } from './Review.entity';
import { Type } from './Type.entity';

@Entity()
export class Video {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  director: string;

  @Column()
  actor: string;

  @Column()
  runtime: string;

  @Column()
  ageLimit: string;

  @Column()
  releaseYear: string;

  @Column()
  posterUrl: string;

  @Column()
  bannerUrl: string;

  @Column()
  netflixUrl: string;

  @OneToMany(() => Review, (review) => review.video)
  reviews: Review[];

  @ManyToOne(() => Type, (type) => type.videos)
  type: Type;

  @ManyToMany(() => Genre, (genre) => genre.videos)
  @JoinTable({ name: 'video_genre' })
  genres: Genre[];

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updatedAt: string;
}
