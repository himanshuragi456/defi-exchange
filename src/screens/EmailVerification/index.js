import * as React from "react";
import { injectIntl } from "react-intl";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { setDocumentTitle } from "../../helpers";
import {
    emailVerificationFetch,
    selectCurrentLanguage,
    selectSendEmailVerificationLoading,
    selectSignUpRequireVerification,
    selectUserInfo,
} from "../../modules";
import { ClipLoader } from "react-spinners";
import { logoutFetch } from "../../modules/user/auth";

class EmailVerificationComponent extends React.Component {
    constructor() {
        super(...arguments);

        this.handleClick = () => {
            this.props.emailVerificationFetch({
                email: this.props.location.state.email,
                lang: this.props.i18n.toLowerCase(),
            });
            this.props.history.push("/signin");
        };

        this.handleReturn = () => {
            this.props.logoutFetch({
                redirect: true,
            });
        };
    }

    componentDidMount() {
        setDocumentTitle(
            this.props.intl.formatMessage({
                id: "page.header.navbar.emailVerification",
            })
        );

        if (
            !this.props.location.state ||
            !this.props.location.state.email ||
            !this.props.requireEmailVerification
        ) {
            this.props.history.push("/signin");
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (
            this.props.requireEmailVerification !==
            prevProps.requireEmailVerification
        )
            this.props.history.push("/signin");
    }

    render() {
        const { emailVerificationLoading } = this.props;
        const title = this.props.intl.formatMessage({
            id: "page.header.signUp.modal.header",
        });
        const text = this.props.intl.formatMessage({
            id: "page.header.signUp.modal.body",
        });
        const button = this.props.intl.formatMessage({
            id: "page.resendConfirmation",
        });
        const login = this.props.intl.formatMessage({
            id: "page.forgotPassword.back",
        });
        return (
            <div class="page-ath-wrap pt-5">
                <div class="container">
                    <div class="row justify-content-center">
                        <div class="col-lg-10 col-xl-8">
                            <div
                                class="card content-area"
                                style={{
                                    backgroundColor: "var(--main-bg)",
                                    border: "1px solid var(--header-border)",
                                    boxShadow: "0 0 20px rgb(0 0 0 / 8%)",
                                }}
                            >
                                <div class="card-innr">
                                    <div class="status status-thank px-md-5">
                                        <div class="status-icon">
                                            <em class="ti ti-check" />
                                        </div>
                                        <span class="status-text large">
                                            {title}
                                        </span>
                                        <p class="px-md-5">{text}</p>
                                        <div>
                                            {emailVerificationLoading ? (
                                                <ClipLoader
                                                    sizeUnit="px"
                                                    size={35}
                                                    loading={true}
                                                    color="var(--accent)"
                                                />
                                            ) : (
                                                <button
                                                    className="btn btn-primary"
                                                    onClick={this.handleClick}
                                                >
                                                    {button}
                                                </button>
                                            )}
                                        </div>
                                        <div>
                                            <button
                                                className="btn btn-danger"
                                                onClick={this.handleReturn}
                                            >
                                                {login}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="gaps-1x" />
                            <div class="gaps-3x d-none d-sm-block" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    emailVerificationLoading: selectSendEmailVerificationLoading(state),
    i18n: selectCurrentLanguage(state),
    userData: selectUserInfo(state),
    requireEmailVerification: selectSignUpRequireVerification(state),
});

const mapDispatchProps = {
    emailVerificationFetch,
    logoutFetch,
};
export const EmailVerificationScreen = injectIntl(
    withRouter(
        connect(mapStateToProps, mapDispatchProps)(EmailVerificationComponent)
    )
);
