import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Genre } from 'src/entity/Genre.entity';
import { Video } from 'src/entity/Video.entity';
import { Repository } from 'typeorm';
import { VideoDto } from './dto/videoDto';

@Injectable()
export class VideosService {
  constructor(
    @InjectRepository(Video) private videoRepository: Repository<Video>,
    @InjectRepository(Genre) private genreRepository: Repository<Genre>,
  ) {
    this.videoRepository = videoRepository;
    this.genreRepository = genreRepository;
  }

  async findVidWithId(videoId: number) {
    return await this.videoRepository.findOne({ id: videoId });
  }

  async addThisVideo(newVideo: VideoDto) {
    const videoBox = [];
    const genreBox = [];

    const video = new Video();
    video.title = newVideo.title;
    video.actor = newVideo.actor;
    video.ageLimit = newVideo.ageLimit;
    video.bannerUrl = newVideo.bannerUrl;
    video.description = newVideo.description;
    video.director = newVideo.director;
    video.netflixUrl = newVideo.netflixUrl;
    video.posterUrl = newVideo.posterUrl;
    video.releaseYear = newVideo.releaseYear;
    video.type = newVideo.type;
    video.runtime = newVideo.runtime;
    video.genres = genreBox;

    for (const genre of newVideo.genres) {
      const isGenre = await this.genreRepository.findOne({ name: genre });

      if (!isGenre) {
        const newGenre = new Genre();
        genreBox.push(newGenre);
        newGenre.name = genre;
        newGenre.videos = [video];
        await this.genreRepository.save(newGenre);
      } else {
        const rawVideos = await this.videoRepository
          .createQueryBuilder('video')
          .leftJoinAndSelect('video.genres', 'genre')
          .getMany();

        for (const video of rawVideos) {
          let isInGenre = false;
          for (const rawGenre of video.genres) {
            if (rawGenre.name === genre) {
              isInGenre = true;
            }
          }
          if (isInGenre) {
            videoBox.push(video);
          }
        }

        const newGenre = new Genre();
        newGenre.name = isGenre.name;
        newGenre.videos = videoBox;
        genreBox.push(newGenre);
        await this.genreRepository.save(newGenre);
      }
    }

    await this.videoRepository.save(video);
  }
}
