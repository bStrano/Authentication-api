import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RefreshTokens } from '../entities/refresh.tokens.entity';

@Injectable()
export class RefreshTokenRepository {
  constructor(
    @InjectRepository(RefreshTokens)
    private readonly refreshTokenRepository: Repository<RefreshTokens>,
  ) {}

  async findOne(refreshToken: Partial<RefreshTokens>) {
    return this.refreshTokenRepository.findOne({ where: refreshToken });
  }

  async deleteByCode(code: string) {
    return this.refreshTokenRepository.delete({ code });
  }

  async save(refreshToken: Partial<RefreshTokens>) {
    return this.refreshTokenRepository.save(refreshToken);
  }

  async findOneOrFail(refreshToken: Partial<RefreshTokens>) {
    return this.refreshTokenRepository.findOneOrFail({ where: refreshToken });
  }
}
