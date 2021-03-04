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
import { Genre } from './entity/Genre.entity';
import { LikeReview } from './entity/LikeReview.entity';
import { ConfigModule } from '@nestjs/config';
import { RefreshToken } from './entity/RefreshToken.entity';
import { ImageModule } from './image/image.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter';
import { MailService } from './mail/mail.service';
import { AuthModule } from './auth/auth.module';

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
      entities: [Review, User, Video, Image, Genre, LikeReview, RefreshToken],
      synchronize: true,
    }),
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        secure: false,
        auth: {
          user: process.env.NODEMAILER_USER,
          pass: process.env.NODEMAILER_PASSWORD,
        },
      },
      defaults: {
        from: process.env.NODEMAILER_USER,
      },
    }),
    VideosModule,
    UsersModule,
    ReviewsModule,
    ConfigModule,
    ImageModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService, MailService],
})
export class AppModule {}
