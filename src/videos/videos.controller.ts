import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Request,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ReviewsService } from 'src/reviews/reviews.service';
import { UsersService } from 'src/users/users.service';
import { VideosService } from './videos.service';

@Controller('videos')
export class VideosController {
  constructor(
    private videosService: VideosService,
    private reviewsService: ReviewsService,
    private usersService: UsersService,
  ) {
    this.videosService = videosService;
    this.reviewsService = reviewsService;
    this.usersService = usersService;
  }

  @Get(':videoId')
  async getThisVideo(@Param('videoId') videoId: number) {
    const rawVideoData = await this.videosService.findVidWithId(videoId);
    const avgRating = await this.reviewsService.getThisVidReviewAvgRate(
      videoId,
    );
    console.log(rawVideoData, avgRating);
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
