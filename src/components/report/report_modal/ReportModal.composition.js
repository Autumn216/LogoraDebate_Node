import React from 'react';
import { ModalProvider } from '@logora/debate.dialog.modal';
import { IntlProvider } from 'react-intl';
import { dataProvider, DataProviderContext } from '@logora/debate.data.data_provider';
import { ReportModal } from './ReportModal';

const httpClient = {
    get: () => null,
    post: () => null,
    patch: () => null
};

export const DefaultReportModal = () => {
    const data = dataProvider(httpClient, "https://mock.example.api");

    return (
        <IntlProvider locale="en">
            <ModalProvider>
                <DataProviderContext.Provider value={{ dataProvider: data }}>
                    <ReportModal reportableId={1} reportableType={"argument"} title={"Report this argument"} />
                </DataProviderContext.Provider>
            </ModalProvider>
        </IntlProvider>
    )
};