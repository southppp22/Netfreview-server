import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Genre } from './Genre.entity';
import { Review } from './Review.entity';

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

  @Column()
  type: string;

  @OneToMany(() => Review, (review) => review.video, { cascade: true })
  reviews: Review[];

  @ManyToMany(() => Genre, (genre) => genre.videos, { cascade: true })
  genres: Genre[];

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updatedAt: string;
}
