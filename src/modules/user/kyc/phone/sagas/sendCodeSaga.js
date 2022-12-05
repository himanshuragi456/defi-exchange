import { call, put } from "redux-saga/effects";
import { API } from "../../../../../api";
import { alertPush } from "../../../../public/alert";
import {resendCode, resendCodeData, sendCodeData, sendCodeError} from "../actions";
import {resendCodeSaga} from "./resendCodeSaga";
const sessionsConfig = {
    apiVersion: "barong",
};
export function* sendCodeSaga(action) {
    try {
        yield call(
            API.post(sessionsConfig),
            "/resource/phones",
            action.payload
        );
        yield put(sendCodeData());
        yield put(
            alertPush({
                message: ["success.phone.verification.send"],
                type: "success",
            })
        );
    } catch (error) {
        if (error.message.indexOf("resource.phone.exists") > -1) {
            yield call(resendCodeSaga, action);
        } else {
            yield put(sendCodeError(error));
            yield put(
                alertPush({
                    message: error.message,
                    code: error.code,
                    type: "error",
                })
            );
        }
    }
}
