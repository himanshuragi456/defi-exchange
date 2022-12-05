import * as React from "react";
import { UnderConstructionIcon } from "../../assets/images/UnderConstructionIcon";
import { setDocumentTitle } from "../../helpers";

class UnderConstructionContainer extends React.Component {
    componentDidMount() {
        setDocumentTitle("Under Construction");
    }

    render() {
        return (
            <div
                className={"under-construction-page__wrapper text-center"}
                style={{
                    backgroundColor: "var(--main-bg)",
                }}
            >
                <h1 className={"under-construction-text-1 my-4"}>
                    The Website is Under Construction.
                </h1>
                <div
                    className={"under-construction-icon__wrapper w-50 mx-auto"}
                >
                    <UnderConstructionIcon />
                </div>
                <h2 className={"under-construction-text-2 my-4"}>
                    Please come back later.
                </h2>
            </div>
        );
    }
}

export const UnderConstruction = UnderConstructionContainer;
