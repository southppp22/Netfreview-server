import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Request,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ReviewsService } from 'src/reviews/reviews.service';
import { UsersService } from 'src/users/users.service';
import { VideosService } from './videos.service';
import { TokenService } from '../auth/token.service';

@Controller('videos')
export class VideosController {
  constructor(
    private videosService: VideosService,
    private reviewsService: ReviewsService,
    private usersService: UsersService,
    private tokenService: TokenService,
  ) {
    this.videosService = videosService;
    this.reviewsService = reviewsService;
    this.usersService = usersService;
    this.tokenService = tokenService;
  }

  @Get('/videolist')
  async getVideoList(
    @Query('path') path: string,
    @Query('q') q: string,
    @Request() req,
  ) {
    if (path === 'myPage') {
      const refreshToken = req.cookies.refreshToken;
      if (!refreshToken) {
        throw new UnauthorizedException('로그인 후 이용 가능합니다.');
      }
      const { user } = await this.tokenService.resolveRefreshToken(
        req.cookies.refreshToken,
      );

      const videoList = await this.videosService.getUserVideo(user.id);
      return Object.assign({
        videoList: videoList,
      });
    } else if (path === 'aboutThis') {
      const refreshToken = req.cookies.refreshToken;
      if (!refreshToken) {
        throw new UnauthorizedException('로그인 후 이용 가능합니다.');
      }
      const { user } = await this.tokenService.resolveRefreshToken(
        refreshToken,
      );
      const userId = user.id;
      const videoList = await this.videosService.getUserVideo(userId);
      const videoIds = [];
      for (const video of videoList) {
        videoIds.push(video.id);
      }
      const aboutThisVid = await this.videosService.getUserAboutThis(
        videoIds,
        userId,
      );
      return Object.assign({
        videoList: aboutThisVid,
      });
    } else if (path === 'main') {
      const videoList = await this.videosService.getAllVideoWithReview();
      const videoBox = [];

      // GET TOP5 VID
      for (const video of videoList) {
        const avgRating = await this.reviewsService.getThisVidReviewAvgRate(
          video.id,
        );

        videoBox.push({ ...video, rating: avgRating });
      }
      videoBox.sort((a, b) => b.rating - a.rating);
      const top5Vidbox = videoBox.slice(0, 5);
      videoBox.sort((a, b) => b.reviews.length - a.reviews.length);
      const mostReviewVid = videoBox.slice(0, 5);
      const notMostReviewVid = videoBox.slice(
        videoBox.length - 5,
        videoBox.length,
      );
      console.log(mostReviewVid, notMostReviewVid);
      //리뷰없는거 5개, 최다리뷰 5개

      return Object.assign({
        top5VideoList: top5Vidbox,
        mostReviewVidList: mostReviewVid,
        lessReviewVidList: notMostReviewVid,
        message: '메인페이지 비디오 리스트 모음',
      });
    }

    if (q) {
      const allVideolist = await this.videosService.getSearchVideo(q);
      return Object.assign({
        videoList: allVideolist,
      });
    } else {
      throw new BadRequestException(
        '잘못된 경로의 요청입니다. Path를 확인해주세요',
      );
    }
  }

  @Get(':videoId')
  async getThisVideo(@Param('videoId') videoId: number) {
    const rawVideoData = await this.videosService.findVidWithId(videoId);
    const avgRating = await this.reviewsService.getThisVidReviewAvgRate(
      videoId,
    );
    if (!rawVideoData) throw new BadRequestException('해당 비디오가 없습니다.');

    const genres = await this.videosService.getThisVidGenreWithId(videoId);
    const genreBucket = [];
    for (const genre of genres) {
      genreBucket.push(genre.name);
    }
    return Object.assign({
      ...rawVideoData,
      rating: avgRating,
      genres: genreBucket,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Post('add')
  async addVideo(@Body() body, @Request() req) {
    const user = req.user;
    const admin = await this.usersService.findUserWithName('admin');
    delete admin.password;

    if (user.id === admin.id && user.email === admin.email) {
      return await this.videosService.addThisVideo(body);
    } else {
      throw new UnauthorizedException('허가되지 않은 사용자입니다.');
    }
  }
}
