import React from 'react';
import { MemoryRouter } from "react-router-dom";
import { render, screen } from '@testing-library/react';
import { InformationBox } from './InformationBox';
import { IntlProvider } from 'react-intl';
import { SuggestionCircleIcon } from '@logora/debate.icons';

it('should render with icon, title and description', () => {
	const container = render(
		<MemoryRouter>
            <IntlProvider locale="en">
                <InformationBox 
                    icon={SuggestionCircleIcon}
                    title={"Title"}
                    points={100} 
                    description={"Description"}
                    textLink={"View suggestions"}
                    link={"https://example.fr/test/"}
                    isActive={true}
                />
            </IntlProvider>
        </MemoryRouter>
	);
    expect(container.queryByTestId('icon')).toBeTruthy();
    expect(screen.getByText("Title")).toBeTruthy();
    expect(screen.getByText("Description")).toBeTruthy();
});

it('should render with link', () => {
	const container = render(
		<MemoryRouter>
            <IntlProvider locale="en">
                <InformationBox 
                    icon={SuggestionCircleIcon}
                    title={"Title"}
                    points={100} 
                    description={"Description"}
                    textLink={"View suggestions"}
                    link={"/link"}
                    isActive={true}
                />
            </IntlProvider>
        </MemoryRouter>
	);
    const link = screen.queryAllByRole("link");
    expect(link).toHaveLength(1);
    expect(link[0]).toHaveAttribute('href', '/link');
});

it('should render with disabled module text', () => {
	const container = render(
		<MemoryRouter>
            <IntlProvider locale="en">
                <InformationBox 
                    icon={SuggestionCircleIcon}
                    title={"Title"}
                    points={100} 
                    description={"Description"}
                    textLink={"View suggestions"}
                    link={"https://example.fr/test/"}
                    isActive={false}
                />
            </IntlProvider>
        </MemoryRouter>
	);
    expect(screen.getByText("Module not available on this debate space")).toBeTruthy();
});

it('should render with points number', () => {
	const container = render(
		<MemoryRouter>
            <IntlProvider locale="en">
                <InformationBox 
                    icon={SuggestionCircleIcon}
                    title={"Title"}
                    points={100} 
                    description={"Description"}
                    textLink={"View suggestions"}
                    link={"https://example.fr/test/"}
                    isActive={false}
                />
            </IntlProvider>
        </MemoryRouter>
	);
    expect(screen.getByText("100")).toBeTruthy();
});