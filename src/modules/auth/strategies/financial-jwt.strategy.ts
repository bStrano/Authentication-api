import { Injectable } from '@nestjs/common';
import { EnvironmentService } from '../../../configs/environment/environment.service';
import {
  lookupPlatformName,
  PlatformEnum,
} from '../../../shared/constants/PlatformEnum';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { TokenPayloadInterface } from '../types/TokenPayloadInterface';
import { PassportStrategy } from '@nestjs/passport';

@Injectable()
export class FinancialJwtStrategy extends PassportStrategy(
  Strategy,
  lookupPlatformName(PlatformEnum.FINANCIAL),
) {
  constructor(private readonly environmentService: EnvironmentService) {
    super({
      issuer: `Stralom-${lookupPlatformName(PlatformEnum.AUTHENTICATION)}`,
      audience: `Stralom-${lookupPlatformName(PlatformEnum.FINANCIAL)}`,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: environmentService.accessTokenJwtConfig(
        PlatformEnum.FINANCIAL,
      ).secret,
    });
  }

  async validate(payload: TokenPayloadInterface) {
    return { email: payload.email, sub: payload.sub, name: payload.name };
  }
}
