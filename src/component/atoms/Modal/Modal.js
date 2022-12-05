import classnames from "classnames";
import * as React from "react";

const Modal = (props) => {
    const { className } = props;
    const cx = classnames("base-modal", className);

    if (!props.show) {
        return null;
    }

    return (
        <div className={cx}>
            <div className="base-modal__container">
                <div className="base-modal__container-header">
                    {props.header}
                </div>
                <div className="base-modal__container-content">
                    {props.content}
                </div>
                <div className="base-modal__container-footer">
                    {props.footer}
                </div>
            </div>
        </div>
    );
};

export { Modal };
