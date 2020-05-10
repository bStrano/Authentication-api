require('dotenv').config();
const http = require('http');
const app = require('./app');
const database = require("./database");

const port = process.env.PORT || 3004;
const ip = '0.0.0.0';


const server = http.createServer(app);


server.listen(port, ip, async () => {
    console.log(` Servidor rodando ... em https://${ip}:${port}`);
    await startup();
});

async function startup () {
    console.log('Starting application');
    try {
        console.log('Initializing database module');
        await database.initialize();
    } catch (err) {
        console.error(err);
        process.exit(1); // Non-zero failure code
    }
}


async function shutdown (e) {
    let err = e;
    console.log('Shutting down application');

    try {
        console.log('Closing database module');
        await database.close();
    } catch (e) {
        console.error(e);
        err = err || e;
    }

    console.log('Exiting process');

    if (err) {
        process.exit(1); // Non-zero failure code
    } else {
        process.exit(0);
    }
}

process.on('SIGTERM', () => {
    console.log('Received SIGTERM');

    shutdown();
});

process.on('SIGINT', () => {
    console.log('Received SIGINT');

    shutdown();
});

process.on('uncaughtException', err => {
    console.log('Uncaught exception');
    console.error(err);

    shutdown(err);
});



