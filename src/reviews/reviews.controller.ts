import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UnprocessableEntityException,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { TokenService } from 'src/auth/token.service';
import { VideosService } from 'src/videos/videos.service';
import { ReviewDto } from './dto/postReviewDto';
import { ReviewsService } from './reviews.service';

@Controller('reviews')
export class ReviewsController {
  constructor(
    private reviewsService: ReviewsService,
    private videosService: VideosService,
    private tokenService: TokenService,
  ) {
    this.reviewsService = reviewsService;
    this.videosService = videosService;
    this.tokenService = tokenService;
  }

  @UseGuards(JwtAuthGuard)
  @Post('like')
  async likeThisReview(@Body() body, @Request() req) {
    const user = req.user;
    const review = await this.reviewsService.findReviewWithId(body.reviewId);
    if (!review) {
      throw new NotFoundException('존재하지 않는 리뷰입니다.');
    }
    return await this.reviewsService.addOrRemoveLike(user, review);
  }

  @Get(':videoId')
  async findThisVidReview(
    @Param('videoId') videoId: number,
    @Query('page') page: number,
    @Headers() header,
    @Request() req,
  ): Promise<void> {
    const accessToken = header.authorization;
    const refreshToken = req.cookies.refreshToken;
    const video = await this.videosService.findVidWithId(videoId);

    let myuser;
    if (!accessToken || !refreshToken) {
      myuser = 'guest';
    } else {
      const { user } = await this.tokenService.resolveRefreshToken(
        refreshToken,
      );
      myuser = user;
    }
    console.log(req.user);

    const {
      videoList,
      userReview,
    } = await this.reviewsService.findThisVidAndUserReview(video, myuser);

    if (videoList === null || videoList.length === 0) {
      throw new UnprocessableEntityException(
        '아직 이 비디오에 등록 된 리뷰가 없습니다!',
      );
    }

    const sliceVideoList = videoList.slice(8 * (page - 1), 8 * page);
    return Object.assign({
      totalCount: videoList.length,
      reviewList: sliceVideoList,
      myReview: userReview,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async saveReview(@Body() body: ReviewDto, @Request() request): Promise<void> {
    const user = request.user;
    if (!body.videoId || !body.text || !body.rating) {
      throw new BadRequestException(
        'text 혹은 rating 혹은 videoId가 전달되지 않았습니다.',
      );
    }
    const video = await this.videosService.findVidWithId(body.videoId);
    return await this.reviewsService.saveReview(user, video, body);
  }

  @UseGuards(JwtAuthGuard)
  @Delete()
  async deleteReview(@Body() body) {
    await this.reviewsService.deleteReview(body.reviewId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch()
  async patchReview(@Body() body: ReviewDto, @Request() req): Promise<void> {
    const user = req.user;
    const video = await this.videosService.findVidWithId(body.videoId);
    await this.reviewsService.patchReview(user, video, body);
  }
}
