class RequestError extends Error{
    readonly httpStatus :number;

    constructor(status: number,message?: string) {
        super(message)
        Object.setPrototypeOf(this, new.target.prototype)

        this.httpStatus = status;
    }
}

export default RequestError;
//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjIwNzcxNDY0fQ.AKBY0-wu5LEJBhLJxDoGZNttWM50V-aA_GvC33I6n-U
