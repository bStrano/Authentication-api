import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { RefreshTokenRepository } from '../repositories/refresh-token.repository';
import { RefreshTokens } from '../entities/refresh.tokens.entity';

@Injectable()
export class RefreshTokenService {
  constructor(
    private readonly refreshTokenRepository: RefreshTokenRepository,
  ) {}

  async deleteByCode(userId: number, code: string) {
    const refreshToken = this.refreshTokenRepository.findOne({ userId, code });
    if (!refreshToken) {
      throw new NotFoundException('Token não encontrado');
    }
    return this.refreshTokenRepository.deleteByCode(code);
  }

  async findOneActive(code: string) {
    const token = await this.refreshTokenRepository.findOne({ code });
    if (!token) {
      throw new ForbiddenException('Token não encontrado');
    }
    if (token) {
      if (token.expiryAt < new Date()) {
        throw new ForbiddenException('Token expirado.');
      }
    }
    return token;
  }

  async validateUserActiveToken(code: string, userId: number) {
    return this.refreshTokenRepository.findOneOrFail({ code, userId });
  }

  async save(refreshToken: RefreshTokens) {
    return await this.refreshTokenRepository.save(refreshToken);
  }
}
