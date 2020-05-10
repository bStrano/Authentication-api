import UserDAO from "../dao/UserDAO";
import Crypto from "crypto-js";


class UserController {


    /**
     * Authentication
     * @param {string} email
     * @param {string} password
     * @returns {Promise<boolean|void>}
     */
    static async login (email, password) {
        if (email === "" || password === "") throw new Error("Unauthorized")
        password = Crypto.SHA512(password).toString();
        try {
            let user = await UserDAO.findByEmail(email);
            if (!user) return false;

            let userPasswordBuffer = Crypto.AES.decrypt(user.PASSWORD, process.env.key)
            let userPassword = userPasswordBuffer.toString(Crypto.enc.Utf8)
            if (userPassword === password) {
                return user;
            } else {
                return false;
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
     * @returns {Promise<number>} - return  .id
     */
    static async register (name, email, password) {
        try {
            const passwordHash = Crypto.SHA512(password).toString();
            const passwordEncrypted = Crypto.AES.encrypt(passwordHash, process.env.key).toString();
            return await UserDAO.register(name, email, passwordEncrypted);
        } catch (e) {
            throw e;
        }

    }

}

export default UserController;