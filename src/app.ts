import "reflect-metadata";
import express, {Request, Response} from 'express';
import morgan from 'morgan'
import RequestError from './errors/RequestError';

require('dotenv').config()
const app = express();

const userRouter = require('./routes/authenticationRoutes')

app.use(morgan('dev'));
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb', extended: true}));


app.use('/stralom/authentication', userRouter);

app.use((error: RequestError, req: Request, res: Response,) => {
    console.log("ERROR", error);
    res.status(error.httpStatus || 500);
    res.json({
        error: {
            name: error.name,
            message: error.message,
            code: error.errorCode
        }
    });
});
module.exports = app;
