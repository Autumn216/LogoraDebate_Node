import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { DefaultTagList } from './TagList.composition';
import { TagList } from './TagList';
import { act } from 'react-dom/test-utils';
import { MemoryRouter } from 'react-router';
import { ConfigProvider } from '@logora/debate.context.config_provider';
import { dataProvider, DataProviderContext } from '@logora/debate.data.data_provider';

const httpClient = {
    get: jest.fn(),
    post: jest.fn(),
    patch: jest.fn()
};

beforeEach(() => {
    httpClient.get.mockClear();
    httpClient.post.mockClear();
    httpClient.patch.mockClear();
})

const data = dataProvider(httpClient, "https://mock.example.api");

it('should render tag list with correct content', async () => {
    httpClient.get.mockResolvedValue({ status: 200, data: {
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
    } });

    await act(()=>{
        render(
            <MemoryRouter>
                <ConfigProvider>
                    <DataProviderContext.Provider value={{ dataProvider: data }}>
                        <TagList />
                    </DataProviderContext.Provider>
                </ConfigProvider>
            </MemoryRouter>
        );
    });
    
    expect(httpClient.get).toHaveBeenNthCalledWith(1, "https://mock.example.api/tags?page=1&per_page=4&sort=-created_at&countless=true&api_key=");
    expect(screen.getByText("Science")).toBeTruthy();
    expect(screen.getByText("Sports")).toBeTruthy();
});

it('should render nothing if response is empty', async () => {
    httpClient.get.mockResolvedValue({ status: 200, data: {
        success: true,
        data: []
    } });

    await act(()=>{
        render(
            <MemoryRouter>
                <ConfigProvider>
                    <DataProviderContext.Provider value={{ dataProvider: data }}>
                        <TagList />
                    </DataProviderContext.Provider>
                </ConfigProvider>
            </MemoryRouter>
        );
    });
    
    expect(httpClient.get).toHaveBeenNthCalledWith(1, "https://mock.example.api/tags?page=1&per_page=4&sort=-created_at&countless=true&api_key=");
    expect(screen.queryByText("Science")).toBeFalsy();
    expect(screen.queryByText("Sports")).toBeFalsy();
});

it('should render if api call returns a 500', async () => {
    httpClient.get.mockResolvedValue({ status: 500, data: {
        success: false,
        data: []
    } });

    await act(()=>{
        render(
            <MemoryRouter>
                <ConfigProvider>
                    <DataProviderContext.Provider value={{ dataProvider: data }}>
                        <TagList />
                    </DataProviderContext.Provider>
                </ConfigProvider>
            </MemoryRouter>
        );
    });
    
    expect(httpClient.get).toHaveBeenNthCalledWith(1, "https://mock.example.api/tags?page=1&per_page=4&sort=-created_at&countless=true&api_key=");
    expect(screen.queryByText("Science")).toBeFalsy();
    expect(screen.queryByText("Sports")).toBeFalsy();
});
