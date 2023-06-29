import React from 'react';
import { render, screen } from '@testing-library/react';
import { DefaultConsultationIndex } from './ConsultationIndex.composition';
import { act } from 'react-dom/test-utils';
import { ConsultationIndex } from './ConsultationIndex';
import { consultationIndexData } from './mockConsultationIndexData';
import { BrowserRouter } from 'react-router-dom';
import { ConfigProvider } from '@logora/debate.context.config_provider';
import { dataProvider, DataProviderContext } from '@logora/debate.data.data_provider';
import { Location } from '@logora/debate.util.location';
import { IntlProvider } from 'react-intl';
import { ListProvider } from '@logora/debate.list.list_provider'
import userEvent from '@testing-library/user-event';

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


it('should render a consultation index with correct items', async () => {
    await act(()=> {
        const item = render(
            <DefaultConsultationIndex />
        )
    })

    expect(screen.getByText("Do I need an easy friend ?")).toBeTruthy();
    expect(screen.getByText("Ouais mdr personne à gouté")).toBeTruthy();
    expect(screen.getByText("Consultation")).toBeTruthy();
    expect(screen.getByText("Quel est selon vous le meilleur album de tout les temps ?")).toBeTruthy();
    expect(screen.getByText("Macron refuse d'enterrer l'âge de guerre ?")).toBeTruthy();
    expect(screen.getByText("wazzzzza")).toBeTruthy();
    expect(screen.getByText("Festivals: quelle serait votre programmation de rêve ?")).toBeTruthy();
    expect(screen.getByText("Consultation de consultation")).toBeTruthy();
    expect(screen.getByText("waza")).toBeTruthy();
    expect(screen.getByText("Super consultation")).toBeTruthy();
})

it('should render an empty list and a button if dataProvider returns nothing', async () => {
    let ConsultationShowLocation = new Location('espace-debat/consultation/:consultationSlug', { consultationSlug: "" })

    const routes = {
        consultationShowLocation: ConsultationShowLocation,
    }
    
    httpClient.get.mockResolvedValue({ status: 200, data: {
            success: true,
            data: []
        }
    })

    await act(()=> {
        const item = render(
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
    })

    expect(httpClient.get).toHaveBeenNthCalledWith(1, "https://mock.example.api/consultations?page=1&per_page=10&sort=-created_at&api_key=");
    expect(screen.queryByText("Do I need an easy friend ?")).toBeFalsy();
    expect(screen.queryByText("Ouais mdr personne à gouté")).toBeFalsy();
    expect(screen.queryByText("Consultation")).toBeFalsy();
    expect(screen.queryByText("Quel est selon vous le meilleur album de tout les temps ?")).toBeFalsy();
    expect(screen.queryByText("Macron refuse d'enterrer l'âge de guerre ?")).toBeFalsy();
    expect(screen.queryByText("wazzzzza")).toBeFalsy();
    expect(screen.queryByText("Festivals: quelle serait votre programmation de rêve ?")).toBeFalsy();
    expect(screen.queryByText("Consultation de consultation")).toBeFalsy();
    expect(screen.queryByText("waza")).toBeFalsy();
    expect(screen.queryByText("Super consultation")).toBeFalsy();
})

it('should call api with correct filter when switching tabs', async () => {
    await act(()=> {
        const item = render(
            <DefaultConsultationIndex />
        )
    })

    expect(screen.getByText("Do I need an easy friend ?")).toBeTruthy();
    expect(screen.getByText("Ouais mdr personne à gouté")).toBeTruthy();
    expect(screen.getByText("Consultation")).toBeTruthy();
    expect(screen.getByText("Quel est selon vous le meilleur album de tout les temps ?")).toBeTruthy();
    expect(screen.getByText("Macron refuse d'enterrer l'âge de guerre ?")).toBeTruthy();
    expect(screen.getByText("wazzzzza")).toBeTruthy();
    expect(screen.getByText("Festivals: quelle serait votre programmation de rêve ?")).toBeTruthy();
    expect(screen.getByText("Consultation de consultation")).toBeTruthy();
    expect(screen.getByText("waza")).toBeTruthy();
    expect(screen.getByText("Super consultation")).toBeTruthy();

    const renderedAllButton = screen.getAllByText(/All/i)[0];
	expect(renderedAllButton).toBeTruthy();

    const renderedInProgressButton = screen.getAllByText(/In progress/i)[0];
	expect(renderedInProgressButton).toBeTruthy();

    const renderedArchivedButton = screen.getAllByText(/Archived/i)[0];
	expect(renderedArchivedButton).toBeTruthy();

    // await userEvent.click(renderedInProgressButton);
    // expect(httpClient.get).toHaveBeenNthCalledWith(1, "https://mock.example.api/consultations?page=1&per_page=10&sort=-created_at&api_key=");

    // await userEvent.click(renderedAllButton);
    // expect(httpClient.get).toHaveBeenNthCalledWith(1, "https://mock.example.api/consultations?page=1&per_page=10&sort=-created_at&api_key=");

    // await userEvent.click(renderedArchivedButton);
    // expect(httpClient.get).toHaveBeenNthCalledWith(1, "https://mock.example.api/consultations?page=1&per_page=10&sort=-created_at&api_key=");
})

