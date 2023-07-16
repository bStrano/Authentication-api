import {Injectable} from '@nestjs/common';
import {UsersService} from "../../users/services/users.service";
import {JwtService} from '@nestjs/jwt';
import {TokenPayloadInterface} from "../types/TokenPayloadInterface";
import {User} from "../../users/entities/user.entity";
import {RefreshTokenService} from "../../session/services/refresh-token.service";
import {PlatformEnum} from "../../../shared/constants/PlatformEnum";
import {LoginSessionDto} from "../dto/login-session.dto";
import {EnvironmentService} from "../../../configs/environment/environment.service";
import {addHours} from "date-fns";
import {RefreshTokens} from "../../session/entities/refresh.tokens.entity";

const bcrypt = require('bcrypt');


@Injectable()
export class AuthService {

  constructor(private readonly usersService: UsersService,
              private readonly jwtService: JwtService,
              private readonly sessionService: RefreshTokenService,
              private readonly environmentService: EnvironmentService) {
  }
  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (user) {
      const isEqual = await bcrypt.compare(pass, user.password);
      if(isEqual){
        const { password, ...result } = user;
        return result;
      }
    }
    return null;
  }

  async login(user: User, platform: PlatformEnum) {
    const payload: TokenPayloadInterface = { email: user.email, sub: user.id, name: user.name };
    const refreshToken = await this.generateRefreshToken(payload, platform);
    return {
      accessToken: this.jwtService.sign(payload, {
        secret: this.environmentService.accessTokenJwtConfig(platform).secret,
        expiresIn: `${this.environmentService.accessTokenJwtConfig(platform).expirationTime}s`
      }),
      refreshToken
    };
  }

  async loginSession(loginSessionDto: LoginSessionDto) {
    const refreshToken = await this.sessionService.findOneActive(loginSessionDto.refreshToken);
    await this.jwtService.verify(refreshToken.code);
    const user = await this.usersService.findById(refreshToken.userId);

    await this.sessionService.deleteByCode(user.id, loginSessionDto.refreshToken);
    return this.login(user, refreshToken.platform)
  }

  private generateRefreshToken(payload: TokenPayloadInterface, platform: PlatformEnum) {
    let expirationTime = this.environmentService.refreshTokenJwtConfig(platform).expirationTime / 60 / 60;
    const token = this.jwtService.sign(payload, {
      secret: this.environmentService.refreshTokenJwtConfig(platform).secret,
      expiresIn: `${expirationTime}h`,
    });

    const refreshToken = new RefreshTokens({
      code: token,
      userId: payload.sub,
      expiryAt: addHours(new Date(), expirationTime),
      platform,
    })
    return this.sessionService.save(refreshToken);
  }

  async logout(userId: number, refreshTokenCode: string) {
    return this.sessionService.deleteByCode(userId, refreshTokenCode)
  }
}
