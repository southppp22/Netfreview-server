import * as Faker from 'faker';
import { fake } from 'faker';
import { define } from 'typeorm-seeding';
import { Video } from '../Video.entity';

define(Video, (faker: typeof Faker) => {
  const description = faker.random.word();
  const runtime = faker.random.word();
  const ageLimit = faker.random.word();
  const releaseYear = faker.random.word();
  const posterUrl = faker.random.word();
  const bannerUrl = faker.random.word();
  const netflixUrl  = faker.random.word();
  const video = new Video();

  video.title = 'title';
  video.description = description;
  video.director = 'director';
  video.actor = 'actor';
  video.runtime = runtime;
  video.ageLimit = ageLimit;
  video.releaseYear = releaseYear;
  video.posterUrl = posterUrl;
  video.bannerUrl = bannerUrl;
  video.netflixUrl = netflixUrl;
  video.type = 'type';

  return video;
});
