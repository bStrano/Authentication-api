import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { EnvironmentService } from '../../../configs/environment/environment.service';
import { AuthService } from '../services/auth.service';
import { PlatformEnum } from '../../../shared/constants/PlatformEnum';
import { GoogleStrategyHelper } from './google-base.strategy';

@Injectable()
export class GoogleKeychainStrategy extends PassportStrategy(
  Strategy,
  'google-keychain',
) {
  constructor(
    environmentService: EnvironmentService,
    private readonly authService: AuthService,
  ) {
    const config = environmentService.googleOAuthConfig(PlatformEnum.KEYCHAIN);
    super({
      clientID: config.clientID,
      clientSecret: config.clientSecret,
      callbackURL: config.callbackURL,
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    return GoogleStrategyHelper.validateGoogleUser(
      this.authService,
      accessToken,
      refreshToken,
      profile,
      done,
    );
  }
}
