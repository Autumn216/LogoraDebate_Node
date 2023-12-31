import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ShareBox } from './ShareBox';
import { IntlProvider } from 'react-intl';

it('should render box with share option', () => {
	const container = render(
		<IntlProvider locale="en">
			<ShareBox 
                shareUrl="https://example.com/share-link"
                shareTitle="Here is an interesting link"
                shareText="Hello, I stumbled upon this interesting article about asteroids. You should check it out !"
            />
		</IntlProvider>
	);
    expect(screen.queryAllByRole("button")).toHaveLength(4)
});

it('should copy to clipboard when sharing link', async () => {
    const shareUrl = "https://example.com/share-link";

    Object.assign(window.navigator, {
        clipboard: {
          writeText: jest.fn(),
        },
    });

	const container = render(
		<IntlProvider locale="en">
			<ShareBox 
                shareUrl={shareUrl}
                shareTitle="Here is an interesting link"
                shareText="Hello, I stumbled upon this interesting article about asteroids. You should check it out !"
            />
		</IntlProvider>
	);
    const icons = (screen.queryAllByRole("button"));
    const linkIcon = icons[0];

    userEvent.hover(linkIcon);
    expect(screen.getByText(/Copy to clipboard/i)).toBeTruthy();

    userEvent.click(linkIcon);
    // TODO : add copy to clipboard test
});

it('should open Facebook share link on click', () => {
	const modal = render(
		<IntlProvider locale="en">
			<ShareBox 
                shareUrl="https://example.com/share-link"
                shareTitle="Here is an interesting link"
                shareText="Hello, I stumbled upon this interesting article about asteroids. You should check it out !"
            />
		</IntlProvider>
	);
    const icons = (screen.queryAllByRole("button"));
    const facebookIcon = icons[1];

    userEvent.hover(facebookIcon);
    expect(screen.getByText(/Share on Facebook/i)).toBeTruthy();
});

it('should open twitter share link on click', () => {
	const modal = render(
		<IntlProvider locale="en">
			<ShareBox 
                shareUrl="https://example.com/share-link"
                shareTitle="Here is an interesting link"
                shareText="Hello, I stumbled upon this interesting article about asteroids. You should check it out !"
            />
		</IntlProvider>
	);
    const icons = (screen.queryAllByRole("button"));
    const twitterIcon = icons[2];

    userEvent.hover(twitterIcon);
    expect(screen.getByText(/Share on Twitter/i)).toBeTruthy();
});

it('should open email share on click', () => {
	const modal = render(
		<IntlProvider locale="en">
			<ShareBox 
                shareUrl="https://example.com/share-link"
                shareTitle="Here is an interesting link"
                shareText="Hello, I stumbled upon this interesting article about asteroids. You should check it out !"
            />
		</IntlProvider>
	);
    const icons = (screen.queryAllByRole("button"));
    const mailIcon = icons[3];

    userEvent.hover(mailIcon);
    expect(screen.getByText(/Share by email/i)).toBeTruthy();
});

it('should render box with code share option and copy to clipboard on click', () => {
	const modal = render(
		<IntlProvider locale="en">
			<ShareBox 
                shareUrl="https://example.com/share-link"
                shareTitle="Here is an interesting link"
                shareText="Hello, I stumbled upon this interesting article about asteroids. You should check it out !"
                showShareCode
            />
		</IntlProvider>
	);
    expect(screen.queryAllByRole("button")).toHaveLength(5);

    const icons = (screen.queryAllByRole("button"));
    const codeIcon = icons[4];

    userEvent.hover(codeIcon);
    expect(screen.getByText(/Copy embed code/i)).toBeTruthy();

    userEvent.click(codeIcon);
    // TODO : add copy to clipboard test
});

