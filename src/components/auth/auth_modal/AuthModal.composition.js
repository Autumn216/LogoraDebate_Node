import React from 'react';
import { MemoryRouter } from "react-router";
import { IntlProvider } from 'react-intl';
import { dataProvider, DataProviderContext } from '@logora/debate.data.data_provider';
import { ModalProvider } from '@logora/debate.dialog.modal';
import { ConfigProvider } from '@logora/debate.context.config_provider';
import { AuthProvider } from '@logora/debate.auth.use_auth';
import { AuthModal } from './AuthModal';

const httpClient = {
    get: () => null,
    post: () => null,
    patch: () => null
};

const config = {
    shortname: "myapp",
    auth: {
        type: "social"
    }
};

export const DefaultAuthModal = () => {
    const data = dataProvider(httpClient, "https://mock.example.api");

    return (
        <MemoryRouter>
            <ConfigProvider config={config}>
                <IntlProvider locale="en">
                    <DataProviderContext.Provider value={{ dataProvider: data }}>
                        <AuthProvider>
                            <ModalProvider>
                                <AuthModal onHideModal={null} />
                            </ModalProvider>
                        </AuthProvider>
                    </DataProviderContext.Provider>
                </IntlProvider>
            </ConfigProvider>
        </MemoryRouter>
    );
};