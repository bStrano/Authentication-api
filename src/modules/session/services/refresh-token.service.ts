import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { RefreshTokenRepository } from '../repositories/refresh-token.repository';
import { RefreshTokens } from '../entities/refresh.tokens.entity';
import { LessThan } from 'typeorm';
import { getErrorMessage } from '../../../shared/constants/error-messages';

@Injectable()
export class RefreshTokenService {
  constructor(
    private readonly refreshTokenRepository: RefreshTokenRepository,
  ) {}

  async deleteByCode(userId: number, code: string) {
    const refreshToken = this.refreshTokenRepository.findOne({ userId, code });
    if (!refreshToken) {
      throw new NotFoundException(getErrorMessage('TOKEN_NOT_FOUND', 'en'));
    }
    return this.refreshTokenRepository.deleteByCode(code);
  }

  async findOneActive(code: string) {
    const token = await this.refreshTokenRepository.findOne({ code });
    if (!token) {
      throw new ForbiddenException(getErrorMessage('TOKEN_NOT_FOUND', 'en'));
    }
    if (token) {
      if (token.expiryAt < new Date()) {
        throw new ForbiddenException(getErrorMessage('TOKEN_EXPIRED', 'en'));
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

  /**
   * Manual cleanup method for expired tokens
   * Can be called on-demand (also used by TasksService)
   */
  async cleanupExpiredTokens(): Promise<number> {
    const result = await this.refreshTokenRepository.delete({
      expiryAt: LessThan(new Date()),
    });
    return result.affected || 0;
  }
}
