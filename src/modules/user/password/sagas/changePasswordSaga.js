import { call, put } from "redux-saga/effects";
import { API } from "../../../../api";
import { alertPush } from "../../../public/alert";
import {
    changePasswordError,
    changePasswordSuccess,
    forgotPasswordError,
    forgotPasswordSuccess,
} from "../actions";
const forgotPasswordConfig = {
    apiVersion: "barong",
};
export function* changePasswordSaga(action) {
    try {
        yield call(
            API.post(forgotPasswordConfig),
            "/resource/users/password",
            action.payload
        );
        yield put(changePasswordSuccess());
        yield put(
            alertPush({
                message: ["success.password.changed.successfuly"],
                type: "success",
            })
        );
    } catch (error) {
        yield put(changePasswordError(error));
        yield put(
            alertPush({
                message: error.message,
                code: error.code,
                type: "error",
            })
        );
    }
}
