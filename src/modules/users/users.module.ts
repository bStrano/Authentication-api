import {Module} from "@nestjs/common";
import {UsersService} from "./services/users.service";
import {UserRepository} from "./repositories/user.repository";
import {TypeOrmModule} from "@nestjs/typeorm";
import {User} from "./entities/user.entity";
import {UsersController} from "./controllers/users.controller";

@Module({
    imports: [TypeOrmModule.forFeature([User])],
    controllers: [UsersController],
    providers: [UsersService, UserRepository],
    exports: [UsersService],
})
export class UsersModule {}
