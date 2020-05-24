import GenericDAO from "./GenericDAO";
import User from "../../../Tasks-API/api/model/User";

class UserDAO {
    static checkIfPasswordMatch () {

    }

    /**
     *  Check if the credentials exists
     * @param {string} email
     * @returns {Promise<User>} - User info
     */
    static async findByEmail (email) {
        try {
            const query = `
            SELECT
                   ID as id,
                   NAME as name,
                   ADDRESS as address,
                   PHONE as phone,
                   EMAIL as email,
                   PASSWORD as password,
                   CREATED_AT as created_at,
                   UPDATED_AT as updated_at
            FROM USERS
            WHERE EMAIL = :email
        `;
            let rows = await GenericDAO.select(query, {email});
            if (rows.length === 0) return null;
            return new User(...Object.values(rows[0]));
        } catch (e) {
            throw e;
        }

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