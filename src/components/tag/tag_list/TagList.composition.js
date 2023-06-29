import React from 'react';
import { TagList } from './TagList';
import { MemoryRouter } from 'react-router';
import { ConfigProvider } from '@logora/debate.context.config_provider';
import { dataProvider, DataProviderContext } from '@logora/debate.data.data_provider';

const httpClient = {
    get: () => { return new Promise((resolve, reject) => {
            resolve(
                {
                    status: 200, 
                    data: {
                        success: true,
                        data: [
                            {
                                "id": 79,
                                "name": "science",
                                "display_name": "Science",
                                "taggings_count": "34"
                            },
                            {
                                "id": 89,
                                "name": "sports",
                                "display_name": "Sports",
                                "taggings_count": "52"
                            }
                        ]
                    }
                } 
            );
        });
    },
    post: () => null,
    patch: () => null
};

export const DefaultTagList = () => {
    const data = dataProvider(httpClient, "https://mock.example.api");

    return (
        <MemoryRouter>
            <ConfigProvider>
                <DataProviderContext.Provider value={{ dataProvider: data }}>
                    <TagList />
                </DataProviderContext.Provider>
            </ConfigProvider>
        </MemoryRouter>
    )
};