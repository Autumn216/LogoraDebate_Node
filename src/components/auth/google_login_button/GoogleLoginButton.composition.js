import React from 'react';
import { MemoryRouter } from "react-router";
import { GoogleLoginButton } from './GoogleLoginButton';

export const DefaultGoogleLoginButton = () => {
    return (
        <MemoryRouter>
            <GoogleLoginButton 
                text={"Sign in with Google"}
                googleClientId={"client-id"}
                redirectUri={"https://auth.redirect/uri"}
            />
        </MemoryRouter>
    );
};