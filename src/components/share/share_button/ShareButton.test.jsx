import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ShareButton } from './ShareButton';
import { IntlProvider } from 'react-intl';
import { ConfigProvider } from '@logora/debate.context.config_provider';

it('should render button with share text', () => {
	const container = render(
		<IntlProvider locale="en">
            <ConfigProvider config={{theme:{}}}>
                <ShareButton 
                    showText
                    shareUrl="https://example.com/share-link"
                    shareTitle="Here is an interesting link"
                    shareText="Hello, I stumbled upon this interesting article about asteroids. You should check it out !"
                />
            </ConfigProvider>
		</IntlProvider>
	);
    expect(screen.getByText("Share")).toBeTruthy();
    expect(screen.queryAllByRole("button")).toHaveLength(0);
});

it('should not show text if props false', () => {
	const container = render(
		<IntlProvider locale="en">
            <ConfigProvider config={{theme:{}}}>
                <ShareButton 
                    shareUrl="https://example.com/share-link"
                    shareTitle="Here is an interesting link"
                    shareText="Hello, I stumbled upon this interesting article about asteroids. You should check it out !"
                />
            </ConfigProvider>
		</IntlProvider>
	);
    expect(screen.queryByText("Share")).toBeNull();
    expect(screen.queryAllByRole("button")).toHaveLength(0);
});

it('should show share box when clicking on button', async () => {
	const container = render(
		<IntlProvider locale="en">
            <ConfigProvider config={{theme:{}}}>
                <ShareButton 
                    showText
                    shareUrl="https://example.com/share-link"
                    shareTitle="Here is an interesting link"
                    shareText="Hello, I stumbled upon this interesting article about asteroids. You should check it out !"
                />
            </ConfigProvider>
		</IntlProvider>
	);
    expect(screen.getByText("Share")).toBeTruthy();

    userEvent.click(screen.getByText("Share"));

    await waitFor(() => {
        expect(screen.queryAllByRole("button")).toHaveLength(4);
    });
});

it('should close box when click outside', async () => {
	const container = render(
		<IntlProvider locale="en">
            <ConfigProvider config={{theme:{}}}>
                <ShareButton 
                    showText
                    shareUrl="https://example.com/share-link"
                    shareTitle="Here is an interesting link"
                    shareText="Hello, I stumbled upon this interesting article about asteroids. You should check it out !"
                />
            </ConfigProvider>
		</IntlProvider>
	);
    expect(screen.getByText("Share")).toBeTruthy();

    userEvent.click(screen.getByText("Share"));

    await waitFor(() => {
        expect(screen.queryAllByRole("button")).toHaveLength(4);
    });

    userEvent.click(document.body);

    await waitFor(() => {
        expect(screen.queryAllByRole("button")).toHaveLength(0);
    });
});