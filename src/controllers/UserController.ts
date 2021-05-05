import jwt from "jsonwebtoken";
import UserService from '../services/UserService';


class UserController {


    /**
     * Authentication
     * @param {string} email
     * @param {string} password
     * @returns {Promise<User>}
     */
    static async login (email: string, password: string) {
        return await UserService.login(email, password)
    }

    /**
     * Register an user with the password encrypted
     * @param {string} name
     * @param {string} email
     * @param {string} password
     * @returns {Promise<{id: number, accessToken: string}>} -  {id,accessToken}
     */
    static async register (name: string, email: string, password: string) {
        let userId = await UserService.register(name, email, password);
        const accessToken = jwt.sign({id: userId}, process.env.ACCESS_TOKEN_SECRET);
        return {id: userId, accessToken};
    }

}

export default UserController;
