import {ConfigService} from "@nestjs/config";
import {Inject, Injectable} from "@nestjs/common";

@Injectable()
export class EnvironmentService extends ConfigService {
    constructor(@Inject(ConfigService) private readonly configService: ConfigService) {
        super(configService);
    }

    get jwtSecret(): string {
        return this.configService.get<string>('JWT_SECRET');
    }

    get jwtAccessTokenExpirationTime(): string {
        return this.configService.get<string>('JWT_EXPIRATION_TIME');
    }

    get port(): number {
        return this.configService.get<number>('PORT');
    }

    get environment(): number {
        return this.configService.get<number>('NODE_ENV');
    }

}
