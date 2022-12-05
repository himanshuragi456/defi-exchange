import classnames from "classnames";
import * as React from "react";
import { GridItem } from "../../molecules";

const { WidthProvider, Responsive } = require("react-grid-layout");

const ReactGridLayout = WidthProvider(Responsive);

const generateChildren = (children, layouts) => {
    return (children || layouts.lg).map((child) => (
        <div key={child.i}>
            {child.title ? (
                <GridItem title={child.title}>
                    {child.render ? child.render() : `Child Body ${child.i}`}
                </GridItem>
            ) : (
                <GridItem>
                    {child.render ? child.render() : `Child Body ${child.i}`}
                </GridItem>
            )}
        </div>
    ));
};

const Grid = (props) => {
    const {
        children,
        className,
        draggableHandle,
        rowHeight,
        breakpoints,
        cols,
        layouts,
        onLayoutChange,
    } = props;
    const cx = classnames("base-grid", className);
    const margin = 0.5;
    let unit = "vh";
    if (window.innerWidth < 996) unit = "px";
    return (
        <div data-react-toolbox="grid" className={cx} id="Gridlayout">
            <div className="base-grid__grid-wrapper">
                <ReactGridLayout
                    unit={unit}
                    breakpoints={breakpoints}
                    cols={cols}
                    draggableHandle={draggableHandle}
                    rowHeight={2}
                    isDraggable={false}
                    layouts={layouts}
                    onLayoutChange={onLayoutChange}
                    margin={[margin, margin]}
                >
                    {generateChildren(children, layouts)}
                </ReactGridLayout>
            </div>
        </div>
    );
};

export { Grid };
