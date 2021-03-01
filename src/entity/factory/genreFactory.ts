import { Genre } from '../Genre.entity';
import { Video } from '../Video.entity';
import { Factory, define } from 'typeorm-seeding';

define(Genre, (faker: typeof fakerStatic, factory: Factory) => {
  const genre = new Genre();
  genre.name = 'genre';
  genre.videos = factory(Video)() as any;
  return genre;
});
