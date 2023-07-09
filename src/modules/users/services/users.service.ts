import {Injectable} from "@nestjs/common";
import {USERS_MOCK} from "../mocks/users.mock";

@Injectable()
export class UsersService {

    async findByEmail(email: string){
        return USERS_MOCK.find( item => item.email === email);
    }
}
