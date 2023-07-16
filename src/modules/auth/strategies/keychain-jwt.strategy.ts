import {Injectable} from '@nestjs/common';
import {EnvironmentService} from "../../../configs/environment/environment.service";
import {lookupPlatformName, PlatformEnum} from "../../../shared/constants/PlatformEnum";
import {PassportStrategy} from "@nestjs/passport";
import {ExtractJwt, Strategy} from "passport-jwt";
import {TokenPayloadInterface} from "../types/TokenPayloadInterface";

@Injectable()
export class KeychainJwtStrategy extends PassportStrategy(Strategy, lookupPlatformName(PlatformEnum.KEYCHAIN))  {

     constructor(private readonly environmentService: EnvironmentService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: environmentService.accessTokenJwtConfig(PlatformEnum.KEYCHAIN).secret
        });
    }

    async validate(payload: TokenPayloadInterface) {
        return { email: payload.email, sub: payload.sub, name: payload.name };
    }
}
