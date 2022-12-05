import {
    PASSWORD_CHANGE_FORGOT_PASSWORD_FETCH,
    PASSWORD_CHANGE_FORGOT_PASSWORD_SUCCESS,
    PASSWORD_FORGOT_ERROR,
    PASSWORD_FORGOT_FETCH,
    PASSWORD_FORGOT_SUCCESS,
    CHANGE_PASSWORD_FETCH,
    CHANGE_PASSWORD_ERROR,
    CHANGE_PASSWORD_SUCCESS,
} from "./constants";
export const forgotPassword = (payload) => ({
    type: PASSWORD_FORGOT_FETCH,
    payload,
});
export const forgotPasswordError = (payload) => ({
    type: PASSWORD_FORGOT_ERROR,
    payload,
});
export const forgotPasswordSuccess = () => ({
    type: PASSWORD_FORGOT_SUCCESS,
});
export const changeForgotPasswordFetch = (payload) => ({
    type: PASSWORD_CHANGE_FORGOT_PASSWORD_FETCH,
    payload,
});
export const changeForgotPasswordToken = (payload) => ({
    type: PASSWORD_CHANGE_FORGOT_PASSWORD_FETCH,
    payload,
});
export const changeForgotPasswordSuccess = () => ({
    type: PASSWORD_CHANGE_FORGOT_PASSWORD_SUCCESS,
});

export const changePassword = (payload) => ({
    type: CHANGE_PASSWORD_FETCH,
    payload,
});
export const changePasswordError = (payload) => ({
    type: CHANGE_PASSWORD_ERROR,
    payload,
});
export const changePasswordSuccess = () => ({
    type: CHANGE_PASSWORD_SUCCESS,
});
