import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
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
import { LikeReview } from './entity/LikeReview.entity';
import { ConfigModule } from '@nestjs/config';
import { RefreshToken } from './entity/RefreshToken.entity';
import { ImageController } from './image/image.controller';
import { ImageService } from './image/image.service';

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
      entities: [
        Review,
        User,
        Video,
        Image,
        Type,
        Genre,
        LikeReview,
        RefreshToken,
      ],
      synchronize: true,
    }),
    VideosModule,
    UsersModule,
    ReviewsModule,
    ConfigModule,
  ],
  controllers: [AppController, ImageController],
  providers: [AppService, ImageService],
})
export class AppModule {}
