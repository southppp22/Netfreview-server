import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Video } from 'src/entity/Video.entity';
import { Repository } from 'typeorm';

@Injectable()
export class VideosService {
  constructor(
    @InjectRepository(Video) private videoRepository: Repository<Video>,
  ) {
    this.videoRepository = videoRepository;
  }

  findVidWithId(videoId: number) {
    return this.videoRepository.findOne({ where: [{ id: videoId }] });
  }
}
