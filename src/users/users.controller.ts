import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Request,
  Response,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { LocalAuthGuard } from 'src/auth/guards/local-auth.guard';
import { User } from 'src/entity/User.entity';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {
    this.usersService = usersService;
    this.authService = authService;
  }

  @UseGuards(LocalAuthGuard)
  @Post('signIn')
  async signIn(
    @Request() req,
    @Response({ passthrough: true }) res,
  ): Promise<string | never> {
    const { accessToken, refreshToken } = await this.authService.signIn(
      req.user,
    );
    res.cookie('refreshToken', refreshToken);

    return Object.assign({
      data: { accessToken },
      statusCode: 201,
      statusMsg: '로그인이 성공적으로 되었습니다.',
    });
  }

  @UseGuards(JwtAuthGuard) //test
  @Get('profile')
  getProfile(@Request() req) {
    console.log('controller');
    return req.user;
  }

  @Post('signUp')
  async saveUser(@Body() user: User): Promise<string | never> {
    const { email, nickname } = user;
    let existedUser = await this.usersService.findUserWithEmail(email);

    if (existedUser) {
      throw new HttpException(
        {
          data: null,
          statusCode: HttpStatus.CONFLICT,
          statusMsg: '이미 존재하는 이메일입니다.',
        },
        HttpStatus.CONFLICT,
      );
    }

    existedUser = await this.usersService.findUserWithNickname(nickname);

    if (existedUser) {
      throw new HttpException(
        {
          data: null,
          statusCode: HttpStatus.CONFLICT,
          statusMsg: '이미 존재하는 닉네임입니다.',
        },
        HttpStatus.CONFLICT,
      );
    }

    await this.usersService.saveUser(user);
    return Object.assign({
      data: null,
      statusCode: 201,
      statusMsg: 'saved successfully',
    });
  }
}
