import React, { useState } from "react";
import { Loader } from '@logora/debate.tools.loader';
import StandardErrorBoundary from "@logora/debate.error.standard_error_boundary";

export const withLoading = (Component) => {
    return (props) => {
        const [isLoading, setIsLoading] = useState(props.staticContext ? false : true);
        const showLoader = props.showLoader || true;
        
        return (
            <StandardErrorBoundary>
                <Component {...props} setIsLoading={setIsLoading} isLoading={isLoading} />
                { isLoading && showLoader ? (
                    <Loader />
                ) : null}
            </StandardErrorBoundary>
        );
    }
}