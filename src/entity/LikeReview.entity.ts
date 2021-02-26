import { Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Review } from './Review.entity';
import { User } from './User.entity';

@Entity()
export class LikeReview {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @OneToOne(() => Review, (review) => review.likeReview, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  review: Review;

  @OneToOne(() => User, (user) => user.likeReview, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;
}
