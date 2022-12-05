import cr from "classnames";
import * as React from "react"; // tslint:disable-next-line

const Loader = ({ size = 30, className }) => {
    const classNames = cr("base-loader", className);
    return (
        <div className={classNames}>
            <img width={size} height={size} src={loader} alt="" />
        </div>
    );
};

export { Loader };
