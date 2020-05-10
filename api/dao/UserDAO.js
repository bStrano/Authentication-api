import GenericDAO from "./GenericDAO";

class UserDAO {
    static checkIfPasswordMatch () {

    }

    /**
     *  Check if the credentials exists
     * @param {string} email
     * @returns {Promise<void>} - User info
     */
    static async findByEmail (email) {
        const query = 'SELECT * FROM USERS WHERE EMAIL = :email';
        let rows = await GenericDAO.select(query, {email});
        return rows[0];
    }

    /**
     * Register User
     * @param {string} name - User name
     * @param {string} email - User email
     * @param {string} password - User password
     * @returns {Promise<number>} - id
     */
    static async register (name, email, password) {
        const query = `INSERT INTO USERS(NAME,EMAIL,PASSWORD) VALUES (:name,:email,:password) RETURNING ID into :id`;
        try {
            return await GenericDAO.save(query, {name, email, password});
        } catch (e) {
            throw e;
        }
    }


}

export default UserDAO;