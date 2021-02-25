import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entity/User.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {
    this.userRepository = userRepository;
  }

  findUserWithUserId(userId: number) {
    return this.userRepository.findOne({ where: [{ id: userId }] });
  }

  async findUserWithEmail(email: string): Promise<User[]> {
    return await this.userRepository.find({ where: [{ email }] });
  }

  async findUserWithNickname(nickname: string): Promise<User[]> {
    return await this.userRepository.find({ where: [{ nickname }] });
  }

  async saveUser(user: User): Promise<void> {
    await this.userRepository.save(user);
  }
}
