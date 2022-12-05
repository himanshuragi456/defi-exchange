import cx from "classnames";
import * as React from "react";
import { AlertIcon } from "../AlertIcon/AlertIcon";

const Alert = (props) => {
    const { description, type, title } = props;
    const className = cx("base-alert", {
        "base-alert--error": type === "error",
        "base-alert--success": type === "success",
    });
    return (
        <div className={className}>
            <AlertIcon type={type} />
            <div>
                <p className="base-alert__title">{title}</p>
                <p className="base-alert__description">{description}</p>
            </div>
        </div>
    );
};

export { Alert };
