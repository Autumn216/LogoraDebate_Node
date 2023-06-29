import React from 'react';
import { Footer } from './Footer';
import { IntlProvider } from 'react-intl';

export const DefaultFooter = () => {
    return (
        <IntlProvider locale="en">
            <Footer hideMargins={false} />
        </IntlProvider>
    );
};

export const DefaultFooterWithHiddenMargins = () => {
    return (
        <IntlProvider locale="en">
            <Footer hideMargins={true} />
        </IntlProvider>
    );
}; 