import React from 'react';
import { SourceModal } from './SourceModal';
import { ModalProvider } from '@logora/debate.dialog.modal';
import { dataProvider, DataProviderContext } from '@logora/debate.data.data_provider';
import { IntlProvider } from 'react-intl';

const httpClient = {
    get: () => null,
    post: () => null,
    patch: () => null
};

export const DefaultSourceModal = () => {
    const data = dataProvider(httpClient, "https://mock.example.api");

    return (
        <ModalProvider>
            <IntlProvider locale="en">
                <DataProviderContext.Provider value={{ dataProvider: data }}>
                    <SourceModal 
                        onAddSource={() => console.log("Add source")} 
                        onHideModal={() => console.log("Hide modal")} 
                    />
                </DataProviderContext.Provider>
            </IntlProvider>
        </ModalProvider>
    )
};