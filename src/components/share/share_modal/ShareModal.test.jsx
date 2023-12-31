import React from 'react';
import { render, screen, waitForElementToBeRemoved } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ShareModal } from './ShareModal';
import { ModalProvider } from '@logora/debate.dialog.modal';
import { IntlProvider } from 'react-intl';

it('should render modal with content and title', () => {
	const modal = render(
        <ModalProvider>
            <IntlProvider locale="en">
                <ShareModal 
                    shareUrl="https://app.logora.fr/share/p/48656"
                    shareText="Text"
                    shareTitle="Title"
                    title="Modal title"
                    showShareCode={false}
                />
            </IntlProvider>
        </ModalProvider>
	);

	expect(screen.getByText("Modal title")).toBeTruthy();
	expect(document.body.style.overflowY).toEqual("hidden");

    expect(screen.queryAllByRole("button")).toHaveLength(4);
});

it('should close on click outside', async () => {
	const modal = render(
		<ModalProvider>
            <IntlProvider locale="en">
                <ShareModal 
                    shareUrl="https://app.logora.fr/share/p/48656"
                    shareText="Text"
                    shareTitle="Title"
                    title="Modal title"
                    shareCode='<iframe src="https://api.logora.fr/embed.html?shortname="[...]'
                    showShareCode={true}
                />
            </IntlProvider>
        </ModalProvider>
	);

	expect(screen.getByRole("dialog")).toBeTruthy();
	expect(screen.getByText("Modal title")).toBeTruthy();
    expect(screen.queryAllByRole("button")).toHaveLength(5);
	expect(document.body.style.overflowY).toEqual("hidden");
	await userEvent.click(document.body);

	waitForElementToBeRemoved(screen.getByText("Modal title")).then(() =>
        expect(screen.queryAllByRole("button")).toHaveLength(0)
	)
});