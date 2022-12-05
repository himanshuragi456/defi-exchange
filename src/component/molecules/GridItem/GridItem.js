import classnames from "classnames";
import * as React from "react";

const GridItem = (props) => {
    const { className, children, title } = props;
    const cx = classnames("base-grid-item", className);
    return (
        <div className={cx}>
            {title ? (
                <div className="base-grid-item__header">
                    <div className="base-grid-item__title">{title}</div>
                </div>
            ) : null}
            <div className="base-grid-item__body">{children}</div>
        </div>
    );
};

export { GridItem };
