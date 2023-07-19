import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { RegisterDto } from '../../auth/dto/register.dto';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async findOne(user: Partial<User>) {
    return this.userRepository.findOne({ where: user });
  }

  async save(user: RegisterDto) {
    return this.userRepository.save(user);
  }
}
