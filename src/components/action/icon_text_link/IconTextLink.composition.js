import React from 'react';
import { MemoryRouter } from "react-router";
import { IconTextLink } from './IconTextLink';
import HomeIcon from './HomeIcon.dev'

export const DefaultIconTextLink = () => {
    return (
        <MemoryRouter>
            <IconTextLink to="/page" icon={HomeIcon} text="Home" />
        </MemoryRouter>
    );
};

export const ActiveIconTextLink = () => {
    return (
        <MemoryRouter>
            <IconTextLink to="/page" icon={HomeIcon} text="Home" active />
        </MemoryRouter>
    );
};