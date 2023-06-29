import React from 'react';
import { IntlProvider } from 'react-intl';
import { ConfigProvider } from '@logora/debate.context.config_provider';
import { Location } from '@logora/debate.util.location';
import { SuggestionBlankBox } from "./SuggestionBlankBox";
import { BrowserRouter } from 'react-router-dom';

let SuggestionLocation = new Location('espace-debat/suggestions')

const routes = {
    suggestionLocation: SuggestionLocation,
}

export const DefaultSuggestionBlankBox = () => {
    return(
        <BrowserRouter>
            <IntlProvider locale="en">
                <ConfigProvider routes={{...routes}}>
                    <SuggestionBlankBox />
                </ConfigProvider>
            </IntlProvider>
        </BrowserRouter>
    )
}