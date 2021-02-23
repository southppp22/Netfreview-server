import { Body, Controller, Post } from '@nestjs/common';
import { User } from 'src/entity/User.entity';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {
    this.usersService = usersService;
  }

  @Post('signUp')
  async saveUser(@Body() user: User): Promise<string> {
    await this.usersService.saveUser(user);
    return Object.assign({
      data: null,
      statusCode: 201,
      statusMsg: 'saved successfully',
    });
  }
}
