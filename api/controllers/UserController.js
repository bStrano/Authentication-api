import UserDAO from "../dao/UserDAO";
import Crypto from "crypto-js";
import jwt from "jsonwebtoken";


class UserController {


    /**
     * Authentication
     * @param {string} email
     * @param {string} password
     * @returns {Promise<User>}
     */
    static async login (email, password) {
        console.log(email, password)
        if (email === "" || password === "") throw new Error("Unauthorized")
        password = Crypto.SHA512(password).toString();
        try {
            let user = await UserDAO.findByEmail(email);
            if (!user) return null;

            let userPasswordBuffer = Crypto.AES.decrypt(user.password, process.env.key)
            let userPassword = userPasswordBuffer.toString(Crypto.enc.Utf8)
            if (userPassword === password) {
                user.accessToken = jwt.sign({id: user.id}, process.env.ACCESS_TOKEN_SECRET);
                return user;
            } else {
                return null;
            }
        } catch (e) {
            throw e;
        }
    }

    /**
     * Register an user with the password encrypted
     * @param {string} name
     * @param {string} email
     * @param {string} password
     * @returns {Promise<{id: number, accessToken: string}>} -  {id,accessToken}
     */
    static async register (name, email, password) {
        try {
            const passwordHash = Crypto.SHA512(password).toString();
            const passwordEncrypted = Crypto.AES.encrypt(passwordHash, process.env.key).toString();
            let userId = await UserDAO.register(name, email, passwordEncrypted);
            // noinspection JSPrimitiveTypeWrapperUsage
            const accessToken = jwt.sign({id: userId}, process.env.ACCESS_TOKEN_SECRET);
            return {id: userId, accessToken};
        } catch (e) {
            throw e;
        }

    }

}

export default UserController;