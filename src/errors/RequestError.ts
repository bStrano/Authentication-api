class RequestError extends Error{
    name: string;
    message: string;
    errorCode: number;
    httpStatus: number;
    stack?: string

    constructor (errorCode: number, httpStatus: number, message: string) {
        super();
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


export default RequestError;
