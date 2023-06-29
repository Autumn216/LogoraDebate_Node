import React from 'react';
import { PaginatedList } from './PaginatedList';
import { IntlProvider } from 'react-intl';
import { dataProvider, DataProviderContext } from '@logora/debate.data.data_provider';
import { ListProvider } from '@logora/debate.list.list_provider';

const ListItem = (props) => {
    return (
        <p>{props.item.name}</p>
    )
}

const httpClient = {
    get: () => { return new Promise((resolve, reject) => {
            resolve(
                {
                    "data": {
                        "success": true,
                        "data": [ 
                            { id: 1, name: "First item" },
                            { id: 2, name: "Second item"},
                            { id: 3, name: "Third item"}
                        ]
                    }
                }
            );
        });
    },
    post: () => null,
    patch: () => null
};

export const DefaultPaginatedList = () => {
    const data = dataProvider(httpClient, "https://mock.example.api");

    return (
        <IntlProvider locale="en">
            <ListProvider>
                <DataProviderContext.Provider value={{ dataProvider: data }}>
                    <PaginatedList 
                        currentListId={"itemList"}
                        resource={'/items'} 
                        sort={"-created_at"}
                        loadingComponent={null}
                        resourcePropName={"item"} 
                        perPage={10}
                        withPagination={false}
                        countless={true}
                        staticContext={null}
                        staticResourceName={"getListItem"}
                        display="column"
                    >
                        <ListItem />
                    </PaginatedList>
                </DataProviderContext.Provider>
            </ListProvider>
        </IntlProvider>
    );
};

export const PaginatedListWithPagination = () => {
    const data = dataProvider(httpClient, "https://mock.example.api");

    return (
        <IntlProvider locale="en">
            <ListProvider>
                <DataProviderContext.Provider value={{ dataProvider: data }}>
                    <PaginatedList 
                        currentListId={"itemList"}
                        resource={'/items'} 
                        sort={"-created_at"}
                        loadingComponent={null}
                        resourcePropName={"item"} 
                        perPage={1}
                        withPagination
                        countless={false}
                        staticContext={null}
                        staticResourceName={"getListItem"}
                        display="column"
                        numberElements={3}
                    >
                        <ListItem />
                    </PaginatedList>
                </DataProviderContext.Provider>
            </ListProvider>
        </IntlProvider>
    );
};

export const PaginatedListWithCustomGap = () => {
    const data = dataProvider(httpClient, "https://mock.example.api");

    return (
        <IntlProvider locale="en">
            <ListProvider>
                <DataProviderContext.Provider value={{ dataProvider: data }}>
                    <PaginatedList 
                        currentListId={"itemList"}
                        resource={'/items'} 
                        sort={"-created_at"}
                        loadingComponent={null}
                        resourcePropName={"item"} 
                        perPage={1}
                        withPagination
                        countless={false}
                        staticContext={null}
                        staticResourceName={"getListItem"}
                        display="column"
                        numberElements={3}
                        gap={"2em"}
                    >
                        <ListItem />
                    </PaginatedList>
                </DataProviderContext.Provider>
            </ListProvider>
        </IntlProvider>
    );
};
