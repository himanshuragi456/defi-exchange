import classnames from "classnames";
import * as React from "react";

export class ProgressLabel extends React.Component {
    render() {
        const { progress, isPositive, additional, bidUnit } = this.props;
        const className = classnames({
            "parent-trading-header-progress-label-progress-positive":
                isPositive,
            "parent-trading-header-progress-label-progress-negative":
                !isPositive,
        });
        return (
            <div className="parent-trading-header-progress-label">
                <div
                    className={
                        additional === "24h Volume" || additional === "Change"
                            ? `${className}`
                            : className
                    }
                >
                    {progress} {bidUnit}
                </div>
                <div className="parent-trading-header-progress-label-additional">
                    {additional}
                </div>
            </div>
        );
    }
}
