import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { User } from 'src/entity/User.entity';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {
    this.usersService = usersService;
  }

  @Post('signUp')
  async saveUser(@Body() user: User): Promise<string> | never {
    const { email, nickname } = user;
    let existedUser: User[] | [] = await this.usersService.findUserWithEmail(
      email,
    );

    if (existedUser.length) {
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

    if (existedUser.length) {
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
