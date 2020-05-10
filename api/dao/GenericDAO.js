import DatabaseError from "../errors/DatabaseError";
import Errors from "../../constants/Errors";

const database = require("../../database");
const oracle = require('oracledb');

class GenericDAO {

    static async select (query, binds) {
        try {
            const res = await database.simpleExecute(query, binds);
            return res.rows;
        } catch (e) {
            throw e;
        }
    }

    static async save (query, object, autoCommit = true) {
        try {
            const objectVALUES = Object.assign({}, object, {id: {type: oracle.NUMBER, dir: oracle.BIND_OUT}});
            const res = await database.simpleExecute(query, objectVALUES, {}, null, autoCommit);
            return res.outBinds.id[0];
        } catch (e) {
            throw e;
        }
    }

    static async update (query, object) {
        try {
            const objectVALUES = Object.assign({}, object);
            const res = await database.simpleExecute(query, objectVALUES);

            if (res.rowsAffected === 0) {
                throw new DatabaseError(Errors.DB_NONEXISTENT_ID)
            }
            return res;
        } catch (e) {
            throw e;
        }
    }

    static async delete (query, id) {
        try {
            const res = await database.simpleExecute(query, {id});

            if (res.rowsAffected === 0) {
                throw new DatabaseError(Errors.DB_NONEXISTENT_ID)
            }

            return res;
        } catch (e) {
            throw e;
        }
    }
}

export default GenericDAO;