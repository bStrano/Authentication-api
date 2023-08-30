import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TokenPayloadInterface } from '../types/TokenPayloadInterface';
import { User } from '../../users/entities/user.entity';
import { RefreshTokenService } from '../../session/services/refresh-token.service';
import {
  lookupPlatformName,
  PlatformEnum,
} from '../../../shared/constants/PlatformEnum';
import { LoginSessionDto } from '../dto/login-session.dto';
import { EnvironmentService } from '../../../configs/environment/environment.service';
import { addHours } from 'date-fns';
import { RefreshTokens } from '../../session/entities/refresh.tokens.entity';

import * as bcrypt from 'bcrypt';
import { UserRepository } from '../../users/repositories/user.repository';
import { LoginResponse } from '../responses/LoginResponse';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UserRepository))
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    private readonly sessionService: RefreshTokenService,
    private readonly environmentService: EnvironmentService,
  ) {}
  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.userRepository.findOne({ email });
    if (user) {
      const isEqual = await bcrypt.compare(pass, user.password);
      if (isEqual) {
        const { password, ...result } = user;
        return result;
      }
    }
    return null;
  }

  async login(user: User, platform: PlatformEnum) {
    const payload: TokenPayloadInterface = {
      email: user.email,
      sub: user.id,
      name: user.name,
    };
    const refreshToken = await this.generateRefreshToken(payload, platform);
    return new LoginResponse({
      id: user.id,
      email: user.email,
      name: user.name,
      lastName: user.lastName,
      refreshToken,
      accessToken: this.jwtService.sign(payload, {
        issuer: `Stralom-${lookupPlatformName(PlatformEnum.AUTHENTICATION)}`,
        audience: `Stralom-${lookupPlatformName(platform)}`,
        secret: this.environmentService.accessTokenJwtConfig(platform).secret,
        expiresIn: `${
          this.environmentService.accessTokenJwtConfig(platform).expirationTime
        }s`,
      }),
    });
  }

  async loginSession(loginSessionDto: LoginSessionDto) {
    const refreshToken = await this.sessionService.findOneActive(
      loginSessionDto.refreshToken,
    );
    if (!refreshToken) throw new Error('Invalid refresh token');
    await this.jwtService.verify(refreshToken.code, {
      secret: this.environmentService.refreshTokenJwtConfig(
        refreshToken.platform,
      ).secret,
    });
    const user = await this.userRepository.findOne({ id: refreshToken.userId });

    await this.sessionService.deleteByCode(
      user.id,
      loginSessionDto.refreshToken,
    );
    return this.login(user, refreshToken.platform);
  }

  private generateRefreshToken(
    payload: TokenPayloadInterface,
    platform: PlatformEnum,
  ) {
    const expirationTime =
      this.environmentService.refreshTokenJwtConfig(platform).expirationTime;
    const token = this.jwtService.sign(payload, {
      issuer: `Stralom-${lookupPlatformName(PlatformEnum.AUTHENTICATION)}`,
      audience: `Stralom-${lookupPlatformName(platform)}`,
      secret: this.environmentService.refreshTokenJwtConfig(platform).secret,
      expiresIn: `${expirationTime}s`,
    });

    const refreshToken = new RefreshTokens({
      code: token,
      userId: payload.sub,
      expiryAt: addHours(new Date(), expirationTime),
      platform,
    });
    return this.sessionService.save(refreshToken);
  }

  async logout(userId: number, refreshTokenCode: string) {
    return this.sessionService.deleteByCode(userId, refreshTokenCode);
  }
}
