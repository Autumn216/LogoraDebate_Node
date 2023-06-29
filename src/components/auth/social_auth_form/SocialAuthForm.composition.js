import React from 'react';
import { MemoryRouter } from "react-router";
import { IntlProvider } from 'react-intl';
import { SocialAuthForm } from './SocialAuthForm';

export const DefaultSocialAuthForm = () => {
    return (
        <MemoryRouter>
            <IntlProvider locale="en">
                <SocialAuthForm 
                    onSubmit={(data, authType, lastStep, consent) => false } 
                    facebookClientId={"facebook-client-id"}
                    googleClientId={"google-client-id"}
                    oAuthRedirectUri={"https://redirect-uri.com"} 
                    logoUrl={"https://picsum.photos/200"}
                    providerName={"My company"}
                    termsUrl={"https://example.com/terms"}
                    privacyUrl={"https://example.com/privacy"}
                    forgotPasswordUrl={"http://example.com/forgot_password"} 
                />
            </IntlProvider>
        </MemoryRouter>
    );
};

export const SocialAuthFormWithoutLogo = () => {
    return (
        <MemoryRouter>
            <IntlProvider locale="en">
            <SocialAuthForm 
                    onSubmit={(data, authType, lastStep, consent) => false } 
                    facebookClientId={"facebook-client-id"}
                    googleClientId={"google-client-id"}
                    oAuthRedirectUri={"https://redirect-uri.com"} 
                    providerName={"My company"}
                    termsUrl={"https://example.com/terms"}
                    privacyUrl={"https://example.com/privacy"}
                    forgotPasswordUrl={"http://example.com/forgot_password"} 
                />
            </IntlProvider>
        </MemoryRouter>
    );
};

export const SocialAuthFormLoginForm = () => {
    return (
        <MemoryRouter>
            <IntlProvider locale="en">
            <SocialAuthForm 
                    onSubmit={(data, authType, lastStep, consent) => false } 
                    lastStep={"LOGIN"}
                    facebookClientId={"facebook-client-id"}
                    googleClientId={"google-client-id"}
                    oAuthRedirectUri={"https://redirect-uri.com"} 
                    logoUrl={"https://picsum.photos/200"}
                    providerName={"My company"}
                    termsUrl={"https://example.com/terms"}
                    privacyUrl={"https://example.com/privacy"}
                    forgotPasswordUrl={"http://example.com/forgot_password"} 
                />
            </IntlProvider>
        </MemoryRouter>
    );
};

export const SocialAuthFormSignupForm = () => {
    return (
        <MemoryRouter>
            <IntlProvider locale="en">
            <SocialAuthForm 
                    onSubmit={(data, authType, lastStep, consent) => false } 
                    lastStep={"SIGNUP"}
                    facebookClientId={"facebook-client-id"}
                    googleClientId={"google-client-id"}
                    oAuthRedirectUri={"https://redirect-uri.com"} 
                    logoUrl={"https://picsum.photos/200"}
                    providerName={"My company"}
                    termsUrl={"https://example.com/terms"}
                    privacyUrl={"https://example.com/privacy"}
                    forgotPasswordUrl={"http://example.com/forgot_password"} 
                />
            </IntlProvider>
        </MemoryRouter>
    );
};