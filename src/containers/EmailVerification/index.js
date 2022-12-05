import { Loader } from "@components/components";
import * as React from "react";
import { injectIntl } from "react-intl";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import {
    emailVerificationFetch,
    selectCurrentLanguage,
    selectSendEmailVerificationLoading,
} from "../../modules";

class EmailVerificationComponent extends React.Component {
    constructor() {
        super(...arguments);

        this.handleClick = () => {
            this.props.emailVerificationFetch({
                email: this.props.location.state.email,
                lang: this.props.i18n.toUpperCase(),
            });
        };
    }

    componentDidMount() {
        if (!this.props.location.state || !this.props.location.state.email) {
            this.props.history.push("/signin");
        }
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
        return (
            <div className="parent-emailverification-container">
                <div className="parent-emailverification">
                    <div className="parent-emailverification-title">
                        {title}
                    </div>
                    <div className="parent-emailverification-body">
                        <div className="parent-emailverification-body-text">
                            {text}
                        </div>
                        <div className="parent-emailverification-body-container">
                            {emailVerificationLoading ? (
                                <Loader />
                            ) : (
                                <button
                                    className="parent-emailverification-body-container-button"
                                    onClick={this.handleClick}
                                >
                                    {button}
                                </button>
                            )}
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
});

const mapDispatchProps = {
    emailVerificationFetch,
};
export const EmailVerification = injectIntl(
    withRouter(
        connect(mapStateToProps, mapDispatchProps)(EmailVerificationComponent)
    )
);
