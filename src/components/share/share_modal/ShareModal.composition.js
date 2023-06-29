import React from 'react';
import { ShareModal } from './ShareModal';
import { ModalProvider } from '@logora/debate.dialog.modal';
import { IntlProvider } from 'react-intl';

export const DefaultShareModal = () => {
    return (
        <IntlProvider locale="en">
            <ModalProvider>
                <ShareModal
                    title="Modal title"
                    shareUrl="https://app.logora.fr/share/p/48656"
                    shareTextKey="Text"
                    shareTitleKey="Title"
                    shareCode='<iframe src="https://api.logora.fr/embed.html?shortname="[...]'
                    showShareCode={true}
                />
            </ModalProvider>
        </IntlProvider>
    );
};