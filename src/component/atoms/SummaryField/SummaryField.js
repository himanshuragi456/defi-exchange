import classnames from "classnames";
import * as React from "react";

/**
 * Component to display currency amount with specific label.
 */

const SummaryField = (props) => {
    const { message, className, borderItem, content } = props;
    const cx = classnames(
        "base-summary-field",
        {
            "base-summary-field-border-item": borderItem,
        },
        className
    );
    const symbol = `base-summary-field-border-item-${borderItem}`;
    return (
        <div className={cx}>
            <div className={symbol} />
            <span className="base-summary-field-message">{message}</span>
            <span className="base-summary-field-content">{content}</span>
        </div>
    );
};

export { SummaryField };
