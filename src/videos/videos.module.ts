import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VideosService } from './videos.service';
import { Video } from 'src/entity/Video.entity';
import { VideosController } from './videos.controller';
import { ReviewsModule } from 'src/reviews/reviews.module';
import { UsersModule } from 'src/users/users.module';
import { Genre } from 'src/entity/Genre.entity';
import { AuthModule } from 'src/auth/auth.module';
import { Review } from 'src/entity/Review.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Video, Genre, Review]),
    forwardRef(() => ReviewsModule),
    UsersModule,
    AuthModule,
  ],
  controllers: [VideosController],
  providers: [VideosService],
  exports: [VideosService],
})
export class VideosModule {}
