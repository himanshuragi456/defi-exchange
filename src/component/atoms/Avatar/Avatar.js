import classnames from "classnames";
import * as React from "react";

/**
 * Component to display cryptobase-react Avatar
 */

const Avatar = (props) => {
    const { title, className, source } = props;
    const cx = classnames("base-avatar", className);
    return (
        <div className={cx}>
            {source ? (
                <img src={source} alt={title} />
            ) : (
                <div className="base-avatar__image">{title}</div>
            )}
        </div>
    );
};

export { Avatar };
