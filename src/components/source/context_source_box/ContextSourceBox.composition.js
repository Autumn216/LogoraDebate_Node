import React from 'react';
import { IntlProvider } from 'react-intl';
import { ContextSourceBox } from './ContextSourceBox';

export const DefaultContextSourceBox = () => {
    return (
        <IntlProvider locale="en">
            <ContextSourceBox 
                imageUrl="https://picsum.photos/200"
                author="Logora"
                date="2022-07-19T13:56:53.809Z"
                title="An interesting article about cats" 
            />
        </IntlProvider>);
};