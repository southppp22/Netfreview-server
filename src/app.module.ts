import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { VideosController } from './videos/videos.controller';
import { VideosService } from './videos/videos.service';
import { VideosModule } from './videos/videos.module';
import { UsersModule } from './users/users.module';
import { ReviewsModule } from './reviews/reviews.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Review } from './entity/Review.entity';
import { User } from './entity/User.entity';
import { Video } from './entity/Video.entity';
import { Image } from './entity/Image.entity';
import { Type } from './entity/Type.entity';
import { Genre } from './entity/Genre.entity';
import { Like } from './entity/Like.entity';
import { ConfigModule } from '@nestjs/config';
import { ReviewsController } from './reviews/reviews.controller';
import { ReviewsService } from './reviews/reviews.service';
import { UsersService } from './users/users.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DATABASE_HOST,
      port: 3306,
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE,
      autoLoadEntities: true,
      entities: [Review, User, Video, Image, Type, Genre, Like],
      synchronize: true,
    }),
    VideosModule,
    UsersModule,
    ReviewsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}