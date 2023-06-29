import React from 'react';
import { render, screen } from '@testing-library/react';
import { DefaultDebateRelatedList } from './DebateRelatedList.composition';
import { act } from 'react-dom/test-utils';
import { DebateRelatedList } from './DebateRelatedList';
import { debateRelatedListData } from './mockDebateRelatedList';
import { BrowserRouter } from 'react-router-dom';
import { ConfigProvider } from '@logora/debate.context.config_provider';
import { dataProvider, DataProviderContext } from '@logora/debate.data.data_provider';
import { Location } from '@logora/debate.util.location';
import { IntlProvider } from 'react-intl';
import { ListProvider } from '@logora/debate.list.list_provider'

const httpClient = {
    get: jest.fn(),
    post: jest.fn(),
    patch: jest.fn()
};

beforeEach(() => {
    httpClient.get.mockClear();
    httpClient.post.mockClear();
    httpClient.patch.mockClear();
});

const data = dataProvider(httpClient, "https://mock.example.api");


it('should render a related debate list with correct content', async () => {
    await act(()=> {
        const item = render(
            <DefaultDebateRelatedList />
        )
    })

    expect(screen.getByText("Un débat ?")).toBeTruthy();
    expect(screen.getByText("Non ?")).toBeTruthy();
    expect(screen.getByText("Une suggestion de débat ?")).toBeTruthy();
    expect(screen.getByText("Oui ?")).toBeTruthy();
    expect(screen.getByText("undefined")).toBeTruthy();
    expect(screen.getByText("Weuzeubi")).toBeTruthy();
    // expect(screen.queryByText("Débat en trop")).toBeNull();

    const link = screen.getByText("See more debates");
    expect(link).toBeTruthy();
    expect(link.href).toBe('http://localhost/espace-debat/debats');
})

it('should render an empty list and a button if dataProvider returns nothing', async () => {
    httpClient.get.mockResolvedValue({ status: 200, data: {
            success: true,
            data: []
        }
    })

    let IndexLocation = new Location('espace-debat/debats')
    let DebateShowLocation = new Location('espace-debat/debate/:debateSlug', { debateSlug: "" })
    let UserShowLocation = new Location('espace-debat/user/:userSlug', { userSlug: "" })

    const routes = {
        indexLocation: IndexLocation,
        debateShowLocation: DebateShowLocation,
        userShowLocation: UserShowLocation
    }

    await act(()=> {
        const item = render(
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
    })

    expect(httpClient.get).toHaveBeenNthCalledWith(1, "https://mock.example.api/groups/undefined/related?page=1&per_page=6&countless=true&api_key=");
    expect(screen.queryByText("WTF ?")).toBeFalsy();
    expect(screen.queryByText("Non ?")).toBeFalsy();
    expect(screen.queryByText("Une suggestion de débat ?")).toBeFalsy();
    expect(screen.queryByText("Oui ?")).toBeFalsy();
    expect(screen.queryByText("undefined")).toBeFalsy();
    expect(screen.queryByText("Weuzeubi")).toBeFalsy();
    expect(screen.getByText("See more debates")).toBeTruthy();
})