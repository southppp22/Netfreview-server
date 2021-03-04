import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { hash } from 'bcrypt';
import { createRandomString } from 'src/common/utils/string.util';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,
    private usersService: UsersService,
  ) {
    this.usersService = usersService;
  }

  public async sendTemporaryPassword(email: string): Promise<void> {
    const user = await this.usersService.findUserWithEmail(email);

    if (!user) {
      throw new UnprocessableEntityException('올바르지 않은 이메일 입니다.');
    }

    const { name, password, id } = user;
    const tempPassword = createRandomString(8);
    const hashTempPassword = await hash(tempPassword, 10);

    await this.usersService.updateUserInfo(user, {
      password: hashTempPassword,
    });

    await this.usersService.changePasswordAfterhour(id, password);

    await this.mailerService.sendMail({
      to: email,
      from: process.env.NODEMAILER_USER,
      subject: '[Netfreview]임시 비밀번호 발급',
      html: `<p>${name}님의 임시 비밀번호는 ${tempPassword}입니다. 1시간 내로 비밀번호를 변경해주세요.</p>`,
    });
  }
}
