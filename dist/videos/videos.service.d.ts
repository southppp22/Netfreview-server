import { Genre } from 'src/entity/Genre.entity';
import { Review } from 'src/entity/Review.entity';
import { Video } from 'src/entity/Video.entity';
import { Repository } from 'typeorm';
import { VideoDto } from './dto/videoDto';
export declare class VideosService {
    private videoRepository;
    private genreRepository;
    private reviewRepository;
    constructor(videoRepository: Repository<Video>, genreRepository: Repository<Genre>, reviewRepository: Repository<Review>);
    findVidWithId(videoId: number): Promise<Video>;
    addThisVideo(newVideo: VideoDto): Promise<any>;
    getThisVidGenreWithId(videoId: number): Promise<Genre[]>;
    getUserVideo(userId: string): Promise<any[]>;
    getUserAboutThis(videoIds: number[], userId: string): Promise<any[]>;
    getSearchVideo(q: string): Promise<Video[]>;
}
