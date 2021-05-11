import AuthenticationService from '../services/AuthenticationService';
import RequestError from '../errors/RequestError';
import IRegisterDTO from '../mappers/IRegisterDTO';


class AuthenticationController {
    private readonly authenticationService: AuthenticationService;
    constructor() {
        this.authenticationService = new AuthenticationService();
    }

    async login ({authorization}: { authorization: string }) {
        const [, hash] = authorization?.split(' ');
        const [email, password] = Buffer.from(hash, 'base64')
          .toString()
          .split(':');
        const user =  this.authenticationService.login(email, password);
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
        return  this.authenticationService.register(params);
    }


}

export default AuthenticationController;
