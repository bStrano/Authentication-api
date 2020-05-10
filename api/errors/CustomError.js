class CustomError {

    constructor (errorCode, httpStatus, message) {
        this.name = this.constructor.name;
        this.message = message;
        this.errorCode = errorCode;
        this.httpStatus = httpStatus;
        this.stack = new Error().stack;
        if (typeof Error.captureStackTrace === 'function') {
            Error.captureStackTrace(this, this.constructor);
        } else {
            this.stack = (new Error(message)).stack;
        }
    }
}


export default CustomError;