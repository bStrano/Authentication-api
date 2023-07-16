import {Module} from '@nestjs/common';
import {AuthModule} from "./auth/auth.module";
import {UsersModule} from "./users/users.module";
import {EnvironmentModule} from "../configs/environment/environment.module";
import {ConfigModule} from "@nestjs/config";
import {validate} from "../configs/environment/environment-variables";
import {SessionModule} from "./session/session.module";
import {EnvironmentService} from "../configs/environment/environment.service";
import {TypeOrmModule} from "@nestjs/typeorm";

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
        AuthModule,
        SessionModule,
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule, EnvironmentModule],
            useFactory: (environmentService: EnvironmentService) => ({
                type: 'postgres',
                host: environmentService.databaseInfo.host,
                port: environmentService.databaseInfo.port,
                username: environmentService.databaseInfo.username,
                password: environmentService.databaseInfo.password,
                database: environmentService.databaseInfo.database,
                entities: ['dist/**/*.entity{.js,.ts}', 'src/**/*.entity{.js.ts}'],
                synchronize: false,
            }),
            inject: [EnvironmentService],
        })
    ],
    controllers: [],
    providers: [],
})
export class AppModule {
}
