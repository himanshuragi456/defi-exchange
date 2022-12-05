import * as React from "react";

const SuccessIcon = () => (
    <div className="base-alert-icon base-alert-icon--success">
        <div className="base-alert-icon--success__left" />
        <div className="base-alert-icon--success__center" />
        <div className="base-alert-icon--success__right" />
    </div>
);

const ErrorIcon = () => (
    <div className="base-alert-icon base-alert-icon--error">
        <div className="base-alert-icon--error__left" />
        <div className="base-alert-icon--error__right" />
    </div>
);

const AlertIcon = (props) => {
    const { type } = props;
    return type === "success" ? <SuccessIcon /> : <ErrorIcon />;
};

export { AlertIcon, ErrorIcon, SuccessIcon };
