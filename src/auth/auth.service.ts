import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { User } from 'src/entity/User.entity';
import { UserDto } from 'src/users/dto/UserDto';
import { ResponseUser } from 'src/users/interfaces/reponseUser.interface';
import { UsersService } from 'src/users/users.service';
import { ResponseOAuthLogin } from './interfaces/responseOAuthLogin.interface';
import { TokenService } from './token.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private tokenService: TokenService,
  ) {
    this.usersService = usersService;
    this.tokenService = tokenService;
  }

  async validateUser(email: string, pass: string): Promise<ResponseUser> {
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

    delete user.password;
    return user;
  }

  async validateOAuthLogin(
    userProfile: UserDto,
    provider: string,
  ): Promise<ResponseOAuthLogin> {
    const { email, name, profileUrl, id } = userProfile;
    let user = await this.usersService.findUserWithEmail(`${email}[AUTH]`);

    if (!user) {
      const newUser = new User();
      newUser.id = id;
      newUser.email = `${email}[AUTH]`;
      newUser.name = name;
      newUser.profileUrl = profileUrl;
      newUser.nickname = await this.usersService.generateRandomNickname();
      user = await this.usersService.saveUser(newUser, provider);
    }
    const accessToken = await this.tokenService.generateAccessToken(user);
    const refreshToken = await this.tokenService.generateRefreshToken(user);
    return { user, tokens: { accessToken, refreshToken } };
  }
}
