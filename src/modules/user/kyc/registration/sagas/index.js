import { takeEvery } from "redux-saga/effects";
import { SEND_REGISTRATION_FETCH } from "../constants";
import { sendRegistrationSaga } from "./sendRegistrationSaga";
export function* rootSendRegistrationSaga() {
    yield takeEvery(SEND_REGISTRATION_FETCH, sendRegistrationSaga);
}
