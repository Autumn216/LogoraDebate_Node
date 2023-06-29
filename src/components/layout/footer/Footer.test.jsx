import React from 'react';
import { render, screen } from '@testing-library/react';
import { Footer } from './Footer';
import { IntlProvider } from 'react-intl';

it('should render footer with correct text', () => {
	const container = render(
		<IntlProvider locale="en">
			<Footer />
		</IntlProvider>
	);
    expect(screen.getByText("User guide")).toBeTruthy();
    expect(screen.getByText("Suggest an improvement")).toBeTruthy();
    expect(screen.getByText("Terms")).toBeTruthy();
    expect(screen.getByText("Powered by Logora")).toBeTruthy();
});

it('should render footer with correct link', () => {
	const container = render(
		<IntlProvider locale="en">
			<Footer />
		</IntlProvider>
	);
    const links = screen.queryAllByRole("link");
    expect(links).toHaveLength(4);
    expect(links[0]).toHaveAttribute('href', 'https://logora.fr/moderation');
    expect(links[1]).toHaveAttribute('href', 'https://6ao8u160j88.typeform.com/to/mjcnSNqD');
    expect(links[2]).toHaveAttribute('href', 'https://logora.fr/cgu');
    expect(links[3]).toHaveAttribute('href', 'https://logora.fr/');
});