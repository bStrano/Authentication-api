import { ConfigService } from '@nestjs/config';
import { Inject, Injectable } from '@nestjs/common';
import {
  lookupPlatformName,
  PlatformEnum,
} from '../../shared/constants/PlatformEnum';

@Injectable()
export class EnvironmentService extends ConfigService {
  constructor(
    @Inject(ConfigService) private readonly configService: ConfigService,
  ) {
    super(configService);
  }

  accessTokenJwtConfig(platform: PlatformEnum): JwtConfigEnvironment {
    const name = lookupPlatformName(platform);
    const secret = this.configService.get<string>(`${name}_JWT_SECRET`);
    const expirationTime = this.configService.get<number>(
      `${name}_JWT_EXPIRATION_TIME`,
    );
    return { secret, expirationTime };
  }

  refreshTokenJwtConfig(platform: PlatformEnum): JwtConfigEnvironment {
    const name = lookupPlatformName(platform);
    const secret = this.configService.get<string>(`${name}_JWT_REFRESH_SECRET`);
    const expirationTime = this.configService.get<number>(
      `${name}_JWT_REFRESH_EXPIRATION_TIME`,
    );
    return { secret, expirationTime };
  }

  get port(): number {
    return this.configService.get<number>('PORT');
  }

  get environment(): string {
    return this.configService.get<string>('NODE_ENV');
  }

  get databaseInfo() {
    return {
      host: this.configService.get<string>('DB_HOST'),
      port: this.configService.get<number>('DB_PORT'),
      username: this.configService.get<string>('DB_USERNAME'),
      password: this.configService.get<string>('DB_PASSWORD'),
      database: this.configService.get<string>('DB_DATABASE'),
    };
  }

  googleOAuthConfig(platform: PlatformEnum) {
    const name = lookupPlatformName(platform);
    return {
      clientID: this.configService.get<string>(`${name}_GOOGLE_CLIENT_ID`),
      clientSecret: this.configService.get<string>(
        `${name}_GOOGLE_CLIENT_SECRET`,
      ),
      callbackURL: this.configService.get<string>(
        `${name}_GOOGLE_CALLBACK_URL`,
      ),
    };
  }

  frontendUrl(platform: PlatformEnum): string {
    const name = lookupPlatformName(platform);
    return this.configService.get<string>(`${name}_FRONTEND_URL`);
  }
}

interface JwtConfigEnvironment {
  secret: string;
  expirationTime: number;
}
