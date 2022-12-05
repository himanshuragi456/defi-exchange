import { call, put, select } from "redux-saga/effects";
import { API } from "../../../../../api";
import { alertPush } from "../../../../public/alert";
import { sendRegistrationData, sendRegistrationError } from "../actions";
const sessionsConfig = {
    apiVersion: "barong",
};

export function* sendRegistrationSaga(action) {
    try {
        const response = yield call(
            API.post(sessionsConfig),
            "/resource/registration_details",
            action.payload
        );
        const defaultMessage = "success.registration.submitted";
        const { message = defaultMessage } = response;
        yield put(sendRegistrationData({ message }));
        yield put(alertPush({ message: [defaultMessage], type: "success" }));
    } catch (error) {
        yield put(sendRegistrationError({
            message: error.message,
            code: error.code,
            type: "error",
        }));
        yield put(
            alertPush({
                message: error.message,
                code: error.code,
                type: "error",
            })
        );
    }
}
