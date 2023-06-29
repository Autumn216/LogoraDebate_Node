import React from 'react';
import { MemoryRouter } from "react-router";
import { LinkButton } from './LinkButton';

export const DefaultLinkButton = () => {
    return (
        <MemoryRouter>
            <LinkButton to="/page">Default</LinkButton>
        </MemoryRouter>
    );
};