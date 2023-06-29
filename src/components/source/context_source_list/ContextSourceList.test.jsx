import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ContextSourceList } from './ContextSourceList';
import { IntlProvider } from 'react-intl';

it('should render with the correct text', () => {
    const sources = [{
        source_url: "#",
        id: 1,
        origin_image_url: "#",
        publisher: "Logora",
        title: "Title of article",
        published_date: "2022-02-25T11:00:00.000Z"
    }]
	const box = render(
        <IntlProvider locale="en">
            <ContextSourceList 
                sources={sources}
            />
        </IntlProvider>
	);

	expect(screen.getByText("Debate context")).toBeTruthy();
    expect(screen.queryAllByRole("link")).toHaveLength(0);
});

it('should show context source box when clicking on toggle title', async () => {
	const sources = [{
        source_url: "#href1",
        id: 1,
        origin_image_url: "#",
        publisher: "Logora",
        title: "Title of article",
        published_date: "2022-02-25T11:00:00.000Z"
    },
    {
        source_url: "#href2",
        id: 2,
        origin_image_url: "#",
        publisher: "Logora",
        title: "Another article",
        published_date: "2022-02-24T11:00:00.000Z"
    }]
	const box = render(
        <IntlProvider locale="en">
            <ContextSourceList 
                sources={sources}
            />
        </IntlProvider>
	);
    const article = screen.queryByText(/Title of article/);
    expect(article).toBeNull();

    expect(screen.getByText("Debate context")).toBeTruthy();

    userEvent.click(screen.getByText("Debate context"));

    await waitFor(() => {
        const links = screen.queryAllByRole("link");
        expect(links).toHaveLength(2);
        expect(screen.getByText(/Title of article/)).toBeTruthy();
        expect(screen.getByText(/Another article/)).toBeTruthy();
        expect(links[0]).toHaveAttribute('href', '#href1');
        expect(links[1]).toHaveAttribute('href', '#href2');
    });
});