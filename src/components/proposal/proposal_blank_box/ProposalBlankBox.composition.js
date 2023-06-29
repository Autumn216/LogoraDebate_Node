import React from 'react';
import { IntlProvider } from 'react-intl';
import { ProposalBlankBox } from './ProposalBlankBox';

export const DefaultProposalBlankBox = () => {
    return (
        <IntlProvider locale="en">
            <ProposalBlankBox redirectUrl={"https://example.com"} />
        </IntlProvider>
    );
};