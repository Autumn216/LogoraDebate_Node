import React from 'react';
import { DebateRelatedList } from './DebateRelatedList';
import { ConfigProvider } from '@logora/debate.context.config_provider';
import { dataProvider, DataProviderContext } from '@logora/debate.data.data_provider';
import { debateRelatedListData } from './mockDebateRelatedList';
import { Location } from '@logora/debate.util.location';
import { BrowserRouter } from 'react-router-dom'
import { IntlProvider } from 'react-intl';
import { ListProvider } from '@logora/debate.list.list_provider'

let IndexLocation = new Location('espace-debat/debats')
let DebateShowLocation = new Location('espace-debat/debate/:debateSlug', { debateSlug: "" })
let UserShowLocation = new Location('espace-debat/user/:userSlug', { userSlug: "" })

const routes = {
    indexLocation: IndexLocation,
    debateShowLocation: DebateShowLocation,
    userShowLocation: UserShowLocation
}

const httpClient = {
    get: () => { return new Promise((resolve, reject) => {
            resolve(
                {
                    status: 200, 
                    data: {
                        success: true,
                        data: debateRelatedListData
                    }
                } 
            );
        });
    },
    post: () => null,
    patch: () => null
};

export const DefaultDebateRelatedList = () => {
    const data = dataProvider(httpClient, "https://mock.example.api");
    return (
        <BrowserRouter>
            <IntlProvider locale="en">
                <ListProvider>
                    <ConfigProvider config={{ modules: {}, id: 1, ads: {} }} routes={{...routes}}>
                        <DataProviderContext.Provider value={{ dataProvider: data }}>
                            <DebateRelatedList />
                        </DataProviderContext.Provider>
                    </ConfigProvider>
                </ListProvider>
            </IntlProvider>
        </BrowserRouter>
    )
};