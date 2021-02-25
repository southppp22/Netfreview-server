import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { create } from 'domain';
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
  async findThisVidReview(
    @Param('videoId') videoId: number,
    @Query('page') page: number,
  ): Promise<void> {
    const user = await this.userService.findUserWithUserId(1); // token 구현 전까지 임의로 1 지정함
    const video = await this.videosService.findVidWithId(videoId);
    const {
      videoList,
      userReview,
    } = await this.reviewsService.findThisVidAndUserReview(video, user);

    console.log(videoList, userReview);
    const sliceVideoList = videoList.slice(8 * (page - 1), 8 * page);
    return Object.assign({
      reviewList: sliceVideoList,
      myReview: userReview,
    });
  }

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
