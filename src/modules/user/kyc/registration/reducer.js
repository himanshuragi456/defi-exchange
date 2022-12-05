import {
    SEND_REGISTRATION_DATA,
    SEND_REGISTRATION_ERROR,
    SEND_REGISTRATION_FETCH,
} from "./constants";
export const initialRegistrationState = {
    loading: false
};
export const registrationReducer = (state = initialRegistrationState, action) => {
    switch (action.type) {
        case SEND_REGISTRATION_FETCH:
            return {
                ...state,
                loading: true,
                success: undefined,
                error: undefined,
            };
        case SEND_REGISTRATION_DATA:
            return {
                ...state,
                loading: false,
                success: action.payload.message,
                error: undefined,
            };
        case SEND_REGISTRATION_ERROR:
            return {
                success: undefined,
                loading: false,
                error: action.payload,
            };
        default:
            return state;
    }
};
