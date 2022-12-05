import * as React from "react";
import classnames from "classnames";

const Checkbox = (props) => {
    const { checked, className, checkboxClass, disabled, label, onChange, slider } = props;
    const cx = classnames(
        "base-checkbox",
        {
            "base-checkbox__disabled": disabled,
        },
        className
    );
    return (
        <label className={cx}>
            <input
                checked={checked}
                className="base-checkbox__input"
                onChange={onChange}
                type="checkbox"
            />
            <span className={slider ? "slider" : `base-checkbox__checkitem ${checkboxClass || ''}`} />
            <span className="base-checkbox__label">{label}</span>
        </label>
    );
};

export { Checkbox };
