import { Button } from "@components/components";
import * as React from "react";
import { FormattedMessage, injectIntl } from "react-intl";
import { Modal } from "../../components";
import { CloseIcon } from "./../../assets/images/CloseIcon.jsx";

class ModalWithdrawComponent extends React.Component {
    constructor() {
        super(...arguments);

        this.translate = (e) => {
            return this.props.intl.formatMessage({
                id: e,
            });
        };

        this.renderHeaderModalSubmit = () => {
            return (
                <div className="parent-exchange-modal-submit-header-parent">
                    <div className="parent-exchange-modal-submit-header">
                        <FormattedMessage id={this.props.title} />
                        <span>{" " + this.props.currency}</span>
                    </div>
                    <div
                        style={{
                            marginRight: "10px",
                        }}
                        onClick={this.props.onSubmit}
                    >
                        {<CloseIcon />}
                    </div>
                </div>
            );
        };

        this.renderBodyModalSubmit = () => {
            return (
                <div className="parent-exchange-modal-submit-body modal-body__withdraw-submit">
                    <FormattedMessage id="page.modal.withdraw.success.message.content" />
                </div>
            );
        };

        this.renderFooterModalSubmit = () => {
            return (
                <div
                    className="parent-exchange-modal-submit-footer modal-footer__withdraw-submit"
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <Button
                        className="parent-exchange-modal-submit-footer__button-inverse center-min-width-btn"
                        label={this.translate(
                            "page.modal.withdraw.success.button"
                        )}
                        onClick={this.props.onSubmit}
                    />
                </div>
            );
        };
    }

    render() {
        const { show } = this.props;
        return (
            <Modal
                show={show}
                header={this.renderHeaderModalSubmit()}
                content={this.props.render}
                className="deposit-withdraw__custom-modal"
            />
        );
    }
}

export const ModalWithdraw = injectIntl(ModalWithdrawComponent);
