import { Controller, Get, Param } from '@nestjs/common';
import { ReviewsService } from 'src/reviews/reviews.service';
import { VideosService } from './videos.service';

@Controller('videos')
export class VideosController {
  constructor(
    private videosService: VideosService,
    private reviewsService: ReviewsService,
  ) {
    this.videosService = videosService;
    this.reviewsService = reviewsService;
  }

  @Get(':videoId')
  async getThisVideo(@Param('videoId') videoId: number) {
    const rawVideoData = await this.videosService.findVidWithId(videoId);
    const avgRating = await this.reviewsService.getThisVidReviewAvgRate(
      videoId,
    );
    console.log(rawVideoData, avgRating);
  }
}
