const express = require('express');
const app = express();
const morgan = require("morgan");

const userRouter = require('./api/routes/UserRouter')

app.use(morgan('dev'));
app.use(express.json({limit: '50mb', extended: true}));
app.use(express.urlencoded({limit: '50mb', extended: true}));


app.use('/stralom/authentication', userRouter);

app.use((error, req, res,) => {
    console.log("ERROR", error);
    res.status(error.httpStatus || error.status || 500);
    res.json({
        error: {
            name: error.name,
            message: error.message,
            code: error.errorCode
        }
    });
});
module.exports = app;