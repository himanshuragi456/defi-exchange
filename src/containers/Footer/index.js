import { Button } from "@components/components";
import * as React from "react";
import { FormattedMessage } from "react-intl";
import { Link, withRouter } from "react-router-dom";
import { LegalDocuments } from "../LegalDocuments";

class FooterComponent extends React.Component {
    constructor() {
        super(...arguments);
        this.state = {
            showModal: false,
        };

        this.toggleModal = () => {
            this.setState({
                showModal: !this.state.showModal,
            });
        };
    }

    render() {
        const { showModal } = this.state;

        if (window.location.pathname.startsWith("/confirm")) {
            return <React.Fragment />;
        }

        return (
            <React.Fragment>
                <footer className="parent-footer">
                    <span
                        className="parent-footer__link"
                        onClick={this.toggleModal}
                    >
                        <FormattedMessage id="page.footer.legalDocuments" />
                    </span>
                    <LegalDocuments
                        isOpen={showModal}
                        footer={
                            <Button label="Ok" onClick={this.toggleModal} />
                        }
                    />
                    <Link className="parent-footer__link" to="/help">
                        <FormattedMessage id="page.footer.faq" />
                    </Link>
                </footer>
            </React.Fragment>
        );
    }
}

const Footer = withRouter(FooterComponent);
export { Footer };
