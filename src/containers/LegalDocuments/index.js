import * as React from "react";
import { Modal, TabPanel } from "../../components";

const panels = [
    {
        label: "LEGAL NOTES",
        content: <div className="tabs-content">LEGAL NOTES</div>,
    },
    {
        label: "PRIVACY POLICY",
        content: (
            <div id="privacy-policy" className="tabs-content">
                PRIVACY POLICY
            </div>
        ),
    },
    {
        label: "TERM OF SERVICE",
        content: <div className="tabs-content">TERM OF SERVICE</div>,
    },
];

class LegalDocuments extends React.Component {
    constructor() {
        super(...arguments);
        this.state = {
            currentTabIndex: 0,
        };

        this.onCurrentTabChange = (index) =>
            this.setState({
                currentTabIndex: index,
            });

        this.renderModalBody = () => {
            return (
                <div>
                    <TabPanel
                        panels={panels}
                        currentTabIndex={this.state.currentTabIndex}
                        onCurrentTabChange={this.onCurrentTabChange}
                    />
                </div>
            );
        };
    }

    render() {
        return (
            <Modal
                className="parent-legal-docs-modal"
                show={this.props.isOpen}
                header={<h3>Title</h3>}
                content={this.renderModalBody()}
                footer={this.props.footer}
            />
        );
    }
}

export { LegalDocuments };
