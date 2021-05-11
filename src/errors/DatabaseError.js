import RequestError from "./RequestError";
import ERRORS from "../../constants/ERRORS";

class DatabaseError extends RequestError {

    constructor (errorCode) {
        super(errorCode);

        switch (errorCode) {
            case ERRORS.DB_NONEXISTENT_ID:
                this.message = "No values updated";
                this.httpStatus = 400;
        }
    }
}

export default DatabaseError;
