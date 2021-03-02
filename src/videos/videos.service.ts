import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Genre } from 'src/entity/Genre.entity';
import { Review } from 'src/entity/Review.entity';
import { User } from 'src/entity/User.entity';
import { Video } from 'src/entity/Video.entity';
import { Repository } from 'typeorm';
import { VideoDto } from './dto/videoDto';

@Injectable()
export class VideosService {
  constructor(
    @InjectRepository(Video) private videoRepository: Repository<Video>,
    @InjectRepository(Genre) private genreRepository: Repository<Genre>,
    @InjectRepository(Review) private reviewRepository: Repository<Review>,
  ) {
    this.videoRepository = videoRepository;
    this.genreRepository = genreRepository;
    this.reviewRepository = reviewRepository;
  }

  async findVidWithId(videoId: number) {
    return await this.videoRepository.findOne({ id: videoId });
  }

  async addThisVideo(newVideo: VideoDto) {
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
        newGenre.name = genre;
        await this.genreRepository.save(newGenre);
        genreBox.push(newGenre);
      } else {
        genreBox.push(isGenre);
      }
      await this.videoRepository.save(video);
    }

    return Object.assign({
      message: 'your video added',
      data: video,
    });
  }

  async getThisVidGenreWithId(videoId: number) {
    const video = await this.videoRepository
      .createQueryBuilder('video')
      .leftJoinAndSelect('video.genres', 'genre')
      .where({ id: videoId })
      .getOne();

    return video.genres;
  }

  async getUserVideo(userId: number) {
    const reviews = await this.reviewRepository
      .createQueryBuilder('review')
      .leftJoinAndSelect('review.user', 'user')
      .leftJoinAndSelect('review.video', 'video')
      .getMany();

    const myVideoBox = [];
    for (const review of reviews) {
      if (review.user.id === userId) {
        myVideoBox.push(review.video);
      }
    }

    return myVideoBox;
  }

  async getUserAboutThis(videoIds: number[], userId: number) {
    const userCountObj = {};
    const similarUserIdBox = [];
    const resultRecommandVideoBox = [];
    let previousCount = 0;

    for (const videoId of videoIds) {
      const video = await this.videoRepository
        .createQueryBuilder('video')
        .leftJoinAndSelect('video.reviews', 'review')
        .leftJoinAndSelect('review.user', 'user')
        .where({ id: videoId })
        .getOne();

      for (const review of video.reviews) {
        if (review.user.id === userId) continue;

        const isUser = userCountObj[`${review.user.id}`];
        if (isUser) userCountObj[`${review.user.id}`]++;
        else userCountObj[`${review.user.id}`] = 1;
      }
    }

    for (const key in userCountObj) {
      if (userCountObj[key] > previousCount)
        similarUserIdBox.unshift(Number(key));
      else similarUserIdBox.push(Number(key));

      previousCount = userCountObj[key];
      if (similarUserIdBox.length > 3) break;
    }

    // 추천하는 비디오 배열을 만들어 주는 로직 부분
    for (const user of similarUserIdBox) {
      const thisUserVideo = await this.getUserVideo(user);
      for (const video of thisUserVideo) {
        if (videoIds.includes(video.id)) continue; // 처음 요청 한 유저와 겹치는 비디오 제거

        if (!resultRecommandVideoBox.length) {
          resultRecommandVideoBox.push(video);
          continue;
        }
        let isExist = false;
        for (const boxVideo of resultRecommandVideoBox) {
          if (boxVideo.id === video.id) isExist = true;
        }

        if (!isExist) resultRecommandVideoBox.push(video);
      }
    }
    return resultRecommandVideoBox;

    // 추천하는 비디오 배열을 만들어 주는 로직 부분

    // const genresBox = [];
    // for (const id of videoIds) {
    //   const genres = await this.getThisVidGenreWithId(id);
    //   for (const genre of genres) {
    //     if (!genresBox.includes(genre.name)) {
    //       genresBox.push(genre.name);
    //     }
    //   }
    // }

    // const allVideos = await this.videoRepository
    //   .createQueryBuilder('video')
    //   .leftJoinAndSelect('video.genres', 'genre')
    //   .getMany();

    // const recommandVidBox = [];
    // for (const video of allVideos) {
    //   let isRecommand = true;
    //   for (const genre of video.genres) {
    //     if (genresBox.includes(genre.name)) {
    //       isRecommand = false;
    //     }
    //   }
    //   if (isRecommand) {
    //     recommandVidBox.push(video);
    //   }
    // }
    // return recommandVidBox;
  }

  async getSearchVideo(q: string) {
    if (q) {
      const videoList = await this.videoRepository
        .createQueryBuilder('video')
        .where('video.title like :title', { title: `%${q}%` })
        .getMany();

      return videoList;
    }
    return await this.videoRepository.find();
  }
}
