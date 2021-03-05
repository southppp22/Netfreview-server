import { VideosService } from 'src/videos/videos.service';
import { ReviewDto } from './dto/postReviewDto';
import { ReviewsService } from './reviews.service';
export declare class ReviewsController {
    private reviewsService;
    private videosService;
    constructor(reviewsService: ReviewsService, videosService: VideosService);
    likeThisReview(body: any, req: any): Promise<any>;
    findThisVidReview(videoId: number, page: number, header: any, req: any): Promise<void>;
    saveReview(body: ReviewDto, request: any): Promise<void>;
    deleteReview(body: any): Promise<void>;
    patchReview(body: ReviewDto, req: any): Promise<void>;
}
