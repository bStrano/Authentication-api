import jwt from "jsonwebtoken";
import UserService from '../services/UserService';
import RequestError from '../errors/RequestError';
import IRegisterDTO from '../mappers/IRegisterDTO';


class AuthenticationController {


    async login ({authorization}: { authorization: string }) {
        const [, hash] = authorization?.split(' ');
        const [email, password] = Buffer.from(hash, 'base64')
          .toString()
          .split(':');
        const user =  await UserService.login(email, password);
        if(user){
            return user
        } else {
            throw new RequestError(401,"Invalid credentials")
        }
    }

    /**
     * Register an user with the password encrypted
     * @returns {Promise<{id: number, accessToken: string}>} -  {id,accessToken}
     */
    async register (params: IRegisterDTO) {
        if (!params.name || !params.email || !params.password) {
            throw new RequestError(400)
        }
        let userId = await UserService.register(params);
        const accessToken = jwt.sign({id: userId}, process.env.ACCESS_TOKEN_SECRET);
        return {id: userId, accessToken};
    }

}

export default AuthenticationController;
