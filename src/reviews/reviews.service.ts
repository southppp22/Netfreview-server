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
  async findThisVidAndUserReview(video: Video, user: User) {
    const videoList = await this.reviewRepository.find({ video });
    const userReview = await this.reviewRepository.findOne({ video, user });
    return { videoList, userReview };
  }

  async saveReview(user: User, video: Video, req: ReviewDto) {
    const reviews = new Review();
    reviews.text = req.text;
    reviews.rating = req.rating;
    reviews.user = user;
    reviews.video = video;
    await this.reviewRepository.save(reviews);
  }

  async deleteReview(id: number) {
    await this.reviewRepository.delete({ id: id });
  }

  async patchReview(user: User, video: Video, req: ReviewDto) {
    const review = await this.reviewRepository.findOne({ user, video });
    console.log(review);
    await this.reviewRepository.save({
      id: review.id,
      text: req.text,
      user: review.user,
      video: review.video,
    });
    // review.text = req.text;
    // review.rating = req.rating;
    // review.user = user;
    // review.video = video;
  }
}
