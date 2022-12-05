import { takeEvery } from "redux-saga/effects";
import {
    CHANGE_PASSWORD_FETCH,
    PASSWORD_CHANGE_FORGOT_PASSWORD_FETCH,
    PASSWORD_FORGOT_FETCH,
} from "../constants";
import { changeForgotPasswordSaga } from "./changeForgotPasswordSaga";
import { forgotPasswordSaga } from "./forgotPasswordSaga";
import { changePasswordSaga } from "./changePasswordSaga";
export function* rootPasswordSaga() {
    yield takeEvery(CHANGE_PASSWORD_FETCH, changePasswordSaga);
    yield takeEvery(PASSWORD_FORGOT_FETCH, forgotPasswordSaga);
    yield takeEvery(
        PASSWORD_CHANGE_FORGOT_PASSWORD_FETCH,
        changeForgotPasswordSaga
    );
}
