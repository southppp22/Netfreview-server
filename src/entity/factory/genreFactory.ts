import { Genre } from '../Genre.entity';
import { Video } from '../Video.entity';

declare const define: any;
declare const factory: any;

define(Genre, (faker: typeof fakerStatic) => {
  const name = faker.random.word();
  const genre = new Genre();
  genre.name = name;
  genre.videos = factory(Video)() as any;
  return genre;
});
