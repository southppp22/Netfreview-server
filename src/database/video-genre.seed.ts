// import { Genre } from 'src/entity/Genre.entity';
// import { Factory, Seeder } from 'typeorm-seeding';
// import { Video } from '../entity/Video.entity';

// export default class CreateVideo implements Seeder {
//   public async run(factory: Factory): Promise<any> {
//     const genreNames = [
//       'action',
//       'horror',
//       'funny',
//       'annoy',
//       'etc',
//       'a',
//       'b',
//       'c',
//     ];

//     for (const genreName of genreNames) {
//       const genre = await factory(Genre)().map(async (g) => {
//         g.name = genreName;
//       });
//     }

//     const videoForms = [
//       ['title1', 'director1', 'actor1', 'movie1'],
//       ['title2', 'director2', 'actor2', 'movie2'],
//       ['title3', 'director3', 'actor3', 'drama3'],
//       ['title4', 'director4', 'actor4', 'movie4'],
//       ['title5', 'director5', 'actor5', 'movie5'],
//       ['title6', 'director6', 'actor6', 'drama6'],
//       ['title7', 'director7', 'actor7', 'movie7'],
//       ['title8', 'director8', 'actor8', 'movie8'],
//       ['title9', 'director9', 'actor9', 'drama9'],
//       ['title10', 'director10', 'actor10', 'movie10'],
//       ['title11', 'director11', 'actor11', 'movie11'],
//     ];

//     for (const videoForm of videoForms) {
//       const video = await factory(Video)()
//         .map(async (v) => {
//           v.title = videoForm[0];
//           v.director = videoForm[1];
//           v.actor = videoForm[2];
//           v.type = videoForm[3];
//           return v;
//         })
//         .create();
//       // const teams = await factory(Team)()
//       //   .map(async (team) => {
//       //     team.tournament = tournament;
//       //     return team;
//       //   })
//       //   .createMany(4);
//     }
//   }
// }
