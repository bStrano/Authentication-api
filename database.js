const oracledb = require('oracledb');
const dbConfig = require('./config/database');

async function initialize () {
    try {
        await oracledb.createPool(dbConfig.dbPool);
        console.log("Database iniciado");
    } catch (e) {
        console.log(e);
    }


}

module.exports.initialize = initialize;

async function close () {
    await oracledb.getPool(dbConfig.dbPool.poolAlias).close();
}

module.exports.close = close;


function simpleExecute (statement, binds = [], opts = {}, pool = "AUTHENTICATION", autoCommit = true) {
    console.log("Pool", pool)
    if (!pool) pool = "AUTHENTICATION";
    return new Promise(async (resolve, reject) => {
        let conn;
        opts.outFormat = oracledb.OBJECT;
        opts.autoCommit = autoCommit;

        try {
            conn = await oracledb.getConnection(pool);
            conn.currentSchema = "AUTHENTICATION";
            const result = await conn.execute(statement, binds, opts);

            resolve(result);
        } catch (err) {
            console.error(err);
            reject(err);
        } finally {
            if (conn) { // conn assignment worked, need to close
                try {
                    await conn.close();
                } catch (err) {
                    console.log(err);
                }
            }
        }
    });
}

module.exports.simpleExecute = simpleExecute;
module.exports.initialize = initialize;
