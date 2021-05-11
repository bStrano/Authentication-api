import RequestError from "./RequestError";
import Errors from "../../constants/Errors";

class DatabaseError extends RequestError {

    constructor (errorCode) {
        super(errorCode);

        switch (errorCode) {
            case Errors.DB_NONEXISTENT_ID:
                this.message = "No values updated";
                this.httpStatus = 400;
        }
    }
}

export default DatabaseError;