import {
    SEND_REGISTRATION_DATA,
    SEND_REGISTRATION_ERROR,
    SEND_REGISTRATION_FETCH,
} from "./constants";
export const sendRegistration = (payload) => ({
    type: SEND_REGISTRATION_FETCH,
    payload,
});
export const sendRegistrationData = (payload) => ({
    type: SEND_REGISTRATION_DATA,
    payload,
});
export const sendRegistrationError = (payload) => ({
    type: SEND_REGISTRATION_ERROR,
    payload,
});
