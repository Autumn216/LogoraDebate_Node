import React from 'react';
import { MemoryRouter } from "react-router";
import { IntlProvider } from 'react-intl';
import { SSOForm } from './SSOForm';

export const DefaultSSOForm = () => {
    return (
        <MemoryRouter>
            <IntlProvider locale="en">
                <SSOForm 
                    authType={"oauth2_server"}
                    clientId={"client-id"}
                    scope={"email"}
                    oAuthRedirectUri={"https://redirect-uri.com"} 
                    loginUrl={"https://example.com/login"}
                    signupUrl={"https://example.com/signup"}
                    redirectParameter={"customRedirect"}
                    trackingParameter={"tracker"}
                    trackingValue={"tracker-value"}
                    termsUrl={"https://example.com/terms"}
                />
            </IntlProvider>
        </MemoryRouter>
    );
};


export const SSOFormWithRedirect = () => {
    return (
        <MemoryRouter>
            <IntlProvider locale="en">
                <SSOForm 
                    authType={"other"}
                    loginUrl={"https://example.com/login"}
                    signupUrl={"https://example.com/signup"}
                    termsUrl={"https://example.com/terms"}
                />
            </IntlProvider>
        </MemoryRouter>
    );
};


export const SSOFormWithSubtitle = () => {
    return (
        <MemoryRouter>
            <IntlProvider locale="en">
                <SSOForm 
                    subtitle={"My awesome subtitle to give more info"}
                    clientId={"client-id"}
                    scope={"email"}
                    oAuthRedirectUri={"https://redirect-uri.com"} 
                    showEmailConsent={true}
                    providerName={"FSociety Inc."}
                    termsUrl={"https://example.com/terms"}
                />
            </IntlProvider>
        </MemoryRouter>
    );
};

export const SSOFormWithEmailConsent = () => {
    return (
        <MemoryRouter>
            <IntlProvider locale="en">
                <SSOForm 
                    clientId={"client-id"}
                    scope={"email"}
                    oAuthRedirectUri={"https://redirect-uri.com"} 
                    showEmailConsent={true}
                    providerName={"FSociety Inc."}
                    termsUrl={"https://example.com/terms"}
                />
            </IntlProvider>
        </MemoryRouter>
    );
};

export const SSOFormWithError = () => {
    return (
        <MemoryRouter>
            <IntlProvider locale="en">
                <SSOForm 
                    clientId={"client-id"}
                    scope={"email"}
                    oAuthRedirectUri={"https://redirect-uri.com"} 
                    showEmailConsent={true}
                    providerName={"FSociety Inc."}
                    termsUrl={"https://example.com/terms"}
                    error={true}
                />
            </IntlProvider>
        </MemoryRouter>
    );
};