import { Injectable, Res } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Review } from 'src/entity/Review.entity';
import { User } from 'src/entity/User.entity';
import { Video } from 'src/entity/Video.entity';
import { Repository } from 'typeorm';
import { ReviewDto } from './dto/postReviewDto';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review) private reviewRepository: Repository<Review>,
  ) {
    this.reviewRepository = reviewRepository;
  }

  findAll(): Promise<Review[]> {
    return this.reviewRepository.find();
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  async findThisVidReview(id: number): Promise<any> {
    await this.reviewRepository.find();
  }

  async saveReview(user: User, video: Video, req: ReviewDto) {
    const reviews = new Review();
    reviews.text = req.text;
    reviews.rating = req.rating;
    reviews.user = user;
    reviews.video = video;
    console.log(reviews);
    // console.log(reviews);
    await this.reviewRepository.save(reviews);
  }
}
