import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Patch,
  Post,
  Query,
  UnprocessableEntityException,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { TokenService } from 'src/auth/token.service';
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
    private tokenService: TokenService,
  ) {
    this.reviewsService = reviewsService;
    this.userService = userService;
    this.videosService = videosService;
    this.tokenService = tokenService;
  }

  @UseGuards(JwtAuthGuard)
  @Post('like') // 한 유저가 어떤 비디오에 대해 좋아요를 누름
  async likeThisReview(@Body() req, @Headers() header) {
    const cookie = header.cookie.slice(13);
    const { user } = await this.tokenService.resolveRefreshToken(cookie);
    const review = await this.reviewsService.findReviewWithId(req.reviewId);
    console.log(req);
    return await this.reviewsService.addOrRemoveLike(user, review);
  }

  @Get(':videoId')
  async findThisVidReview(
    @Param('videoId') videoId: number,
    @Query('page') page: number,
    @Headers() header,
  ): Promise<void> {
    const cookie = header.cookie.slice(13);
    const accessToken = header.authorization;
    const video = await this.videosService.findVidWithId(videoId);

    let myuser;
    if (!accessToken) {
      myuser = 'guest';
    } else {
      const { user } = await this.tokenService.resolveRefreshToken(cookie);
      myuser = user;
    }

    const {
      videoList,
      userReview,
    } = await this.reviewsService.findThisVidAndUserReview(video, myuser);

    if (videoList === null) {
      throw new UnprocessableEntityException(
        '아직 이 비디오에 등록 된 리뷰가 없습니다!',
      );
    }

    const sliceVideoList = videoList.slice(8 * (page - 1), 8 * page);
    return Object.assign({
      reviewList: sliceVideoList,
      myReview: userReview,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async saveReview(@Body() req: ReviewDto, @Headers() header): Promise<void> {
    const cookie = header.cookie.slice(13);
    const { user } = await this.tokenService.resolveRefreshToken(cookie);
    const video = await this.videosService.findVidWithId(req.videoId);
    return await this.reviewsService.saveReview(user, video, req);
  }

  @UseGuards(JwtAuthGuard)
  @Delete()
  async deleteReview(@Body() req) {
    await this.reviewsService.deleteReview(req.reviewId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch()
  async patchReview(@Body() req: ReviewDto, @Headers() header): Promise<void> {
    const cookie = header.cookie.slice(13);
    const { user } = await this.tokenService.resolveRefreshToken(cookie);
    const video = await this.videosService.findVidWithId(req.videoId);
    await this.reviewsService.patchReview(user, video, req);
  }
}
