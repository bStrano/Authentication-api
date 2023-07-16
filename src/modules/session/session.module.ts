import {Module} from "@nestjs/common";
import {RefreshTokenService} from "./services/refresh-token.service";
import {RefreshTokenRepository} from "./repositories/refresh-token.repository";
import {TypeOrmModule} from "@nestjs/typeorm";
import {RefreshTokens} from "./entities/refresh.tokens.entity";

@Module({
    imports: [TypeOrmModule.forFeature([RefreshTokens])],
    providers: [RefreshTokenService, RefreshTokenRepository],
    exports: [RefreshTokenService]
})
export class SessionModule {

}
