import React from 'react';
import { InformationBox } from './InformationBox';
import { IntlProvider } from 'react-intl';
import { SuggestionCircleIcon } from '@logora/debate.icons';
import { MemoryRouter } from "react-router-dom";

export const DefaultInformationBox = () => {
    return (
        <MemoryRouter>
            <IntlProvider locale="en">
                <InformationBox 
                    icon={SuggestionCircleIcon}
                    title={"Suggestion"}
                    points={100} 
                    description={"Propose debate questions and support user suggestions that you find relevant."}
                    textLink={"View suggestions"}
                    link={"https://example.fr/test/"}
                    isActive={true}
                />
            </IntlProvider>
        </MemoryRouter>
    );
};

export const DefaultInformationBoxWithDisabledModule = () => {
    return (
        <MemoryRouter>
            <IntlProvider locale="en">
                <InformationBox 
                    icon={SuggestionCircleIcon}
                    title={"Suggestion"}
                    points={100} 
                    description={"Propose debate questions and support user suggestions that you find relevant."}
                    textLink={"View suggestions"}
                    link={"https://example.fr/test/"}
                    isActive={false}
                />
            </IntlProvider>
        </MemoryRouter>
    );
};