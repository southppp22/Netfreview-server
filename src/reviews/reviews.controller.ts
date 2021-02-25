import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { VideosService } from 'src/videos/videos.service';
import { ReviewDto } from './dto/postReviewDto';
import { ReviewsService } from './reviews.service';

@Controller('reviews')
export class ReviewsController {
  constructor(
    private reviewsService: ReviewsService,
    private userService: UsersService,
    private videosService: VideosService,
  ) {
    this.reviewsService = reviewsService;
    this.userService = userService;
    this.videosService = videosService;
  }

  @Get(':videoId')
  // eslint-disable-next-line @typescript-eslint/ban-types
  async findThisVidReview(@Param('videoId') id: number): Promise<void> {
    await this.reviewsService.findThisVidReview(id);
  }

  // @Get(':userId')
  // async findUserReview(@Param('userId') id: number): Promise<void> {
  //   await this.reviewsService.findUserReview(id);
  // }

  @Post()
  async saveReview(@Body() req: ReviewDto): Promise<void> {
    const user = await this.userService.findUserWithUserId(req.userId);
    const video = await this.videosService.findVidWithId(req.videoId);
    await this.reviewsService.saveReview(user, video, req);
  }

  @Delete()
  async deleteReview(@Body() req) {
    await this.reviewsService.deleteReview(req.reviewId);
  }

  @Patch()
  async patchReview(@Body() req: ReviewDto): Promise<void> {
    const user = await this.userService.findUserWithUserId(req.userId);
    const video = await this.videosService.findVidWithId(req.videoId);
    await this.reviewsService.patchReview(user, video, req);
  }
}
