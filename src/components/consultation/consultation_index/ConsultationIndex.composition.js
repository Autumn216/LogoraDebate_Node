import React from 'react';
import { ConsultationIndex } from "./ConsultationIndex";
import { ConfigProvider } from '@logora/debate.context.config_provider';
import { dataProvider, DataProviderContext } from '@logora/debate.data.data_provider';
import { Location } from '@logora/debate.util.location';
import { BrowserRouter } from 'react-router-dom'
import { IntlProvider } from 'react-intl';
import { ListProvider } from '@logora/debate.list.list_provider'
import { consultationIndexData } from './mockConsultationIndexData';

let ConsultationShowLocation = new Location('espace-debat/consultation/:consultationSlug', { consultationSlug: "" })

const routes = {
    consultationShowLocation: ConsultationShowLocation,
}

const httpClient = {
    get: () => { return new Promise((resolve, reject) => {
            resolve(
                {
                    status: 200, 
                    data: {
                        success: true,
                        data: consultationIndexData
                    }
                } 
            );
        });
    },
    post: () => null,
    patch: () => null
};

export const DefaultConsultationIndex = () => {
    const data = dataProvider(httpClient, "https://mock.example.api");
    return (
        <BrowserRouter>
            <IntlProvider locale="en">
                <ListProvider>
                    <ConfigProvider config={{ modules: {}, id: 1, ads: {}, theme: {} }} routes={{...routes}}>
                        <DataProviderContext.Provider value={{ dataProvider: data }}>
                            <ConsultationIndex />
                        </DataProviderContext.Provider>
                    </ConfigProvider>
                </ListProvider>
            </IntlProvider>
        </BrowserRouter>
        
    )
}