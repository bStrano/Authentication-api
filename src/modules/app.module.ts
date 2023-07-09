import {Module} from '@nestjs/common';
import {AuthModule} from "./auth/auth.module";
import {UsersModule} from "./users/users.module";
import {EnvironmentModule} from "../configs/environment/environment.module";
import {ConfigModule} from "@nestjs/config";
import {validate} from "../configs/envinronment/envinronment-variables";


@Module({
    imports: [
        EnvironmentModule,
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: [".env.local"
                , '.env.homology', ".env.production"],
            validate
        }),
        UsersModule,
        AuthModule
    ],
    controllers: [],
    providers: [],
})
export class AppModule {
}
