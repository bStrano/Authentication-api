import "reflect-metadata";
import express, {NextFunction, Request, Response} from 'express';
import morgan from 'morgan'
import RequestError from './errors/RequestError';

require('dotenv').config()
const app = express();

const userRouter = require('./routes/authenticationRoutes')
const sessionRouter = require('./routes/sessionRoutes')

app.use(morgan('dev'));
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb', extended: true}));


app.use('/stralom/authentication', userRouter);
app.use('/stralom/session', sessionRouter);

app.use((error: RequestError, req: Request, res: Response,next: NextFunction) => {
    console.log("ERROR", error);
    res.status(error.httpStatus || 500);
    res.json({
        error: {
            name: error.name,
            message: error.message
        }
    });
});
module.exports = app;
