import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {
    this.usersService = usersService;
  }

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findUserWithEmail(email);

    if (!user) {
      throw new UnprocessableEntityException('이메일이 올바르지 않습니다.');
    }

    const isCorrectPassword = await this.usersService.validateCredentials(
      user,
      pass,
    );

    if (!isCorrectPassword) {
      throw new UnprocessableEntityException('비밀번호가 올바르지 않습니다.');
    }
    const { password, ...result } = user;
    return result;
  }
}
