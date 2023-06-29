import React from 'react';
import { MemoryRouter } from "react-router";
import { FacebookLoginButton } from './FacebookLoginButton';

export const DefaultFacebookLoginButton = () => {
    return (
        <MemoryRouter>
            <FacebookLoginButton 
                text={"Sign in with Facebook"}
                facebookClientId={"client-id"}
                redirectUri={"https://auth.redirect/uri"}
            />
        </MemoryRouter>
    );
};