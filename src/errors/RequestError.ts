class RequestError extends Error{
    readonly httpStatus :number;

    constructor(status: number,message?: string) {
        super(message)
        Object.setPrototypeOf(this, new.target.prototype)

        this.httpStatus = status;
    }
}

export default RequestError;
