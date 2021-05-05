import {createConnection} from 'typeorm';

require('dotenv').config();
const http = require('http');
const app = require('./app');


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
        await createConnection();
    } catch (err) {
        console.error(err);
        process.exit(1); // Non-zero failure code
    }
}




