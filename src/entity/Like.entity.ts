import { Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Review } from './Review.entity';
import { User } from './User.entity';

@Entity()
export class Like {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @OneToOne(() => Review, (review) => review.like)
  @JoinColumn()
  review: Review;

  @OneToOne(() => User, (user) => user.like)
  @JoinColumn()
  user: User;
}
