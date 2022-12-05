import { Button } from "@components/components";
import * as React from "react";
import { FormattedMessage, injectIntl } from "react-intl";
import { Modal } from "../../components";

class ModalWithdrawSubmitComponent extends React.Component {
    constructor() {
        super(...arguments);

        this.translate = (e) => {
            return this.props.intl.formatMessage({
                id: e,
            });
        };

        this.renderHeaderModalSubmit = () => {
            return (
                <div className="parent-exchange-modal-submit-header">
                    <FormattedMessage id="page.modal.withdraw.success" />
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
                <div className="parent-exchange-modal-submit-footer modal-footer__withdraw-submit">
                    <Button
                        className="parent-exchange-modal-submit-footer__button-inverse"
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
                content={this.renderBodyModalSubmit()}
                footer={this.renderFooterModalSubmit()}
            />
        );
    }
}

export const ModalWithdrawSubmit = injectIntl(ModalWithdrawSubmitComponent);
