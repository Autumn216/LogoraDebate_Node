import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { ConfigContext } from '@logora/debate.context.config_provider';
import { useAuthenticationRequired } from './useAuthenticationRequired';
import { useModal } from '@logora/debate.dialog.modal';

jest.mock('@logora/debate.dialog.modal', () => ({
    useModal: jest.fn(),
}));

const TestComponent = () => {
    const requireAuthentication = useAuthenticationRequired();

    return (
        <div>
            <button onClick={() => requireAuthentication({ foo: 'bar' })}>
                Authenticate
            </button>
        </div>
    );
};

describe('useAuthenticationRequired', () => {
    const showModal = jest.fn();
    const hideModal = jest.fn();

    beforeEach(() => {
        useModal.mockReturnValue({
            showModal,
            hideModal,
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should call requireAuthentication on button click', () => {
        const config = {
            auth: {
                disableLoginModal: false,
            },
        };

        const redirectUrl = window.location.href;

        window.dispatchEvent = jest.fn();

        const { getByText } = render(
            <ConfigContext.Provider value={{ config }}>
                <TestComponent />
            </ConfigContext.Provider>
        );

        fireEvent.click(getByText('Authenticate'));

        expect(window.dispatchEvent).toHaveBeenCalledWith(
            new CustomEvent('LOGORA::authenticationRequired', { detail: { redirectUrl } })
        );
    });

    it('should not show AuthModal if disableLoginModal is true', () => {
        const config = {
            auth: {
                disableLoginModal: true,
            },
        };

        const redirectUrl = window.location.href;

        const { getByText } = render(
            <ConfigContext.Provider value={{ config }}>
                <TestComponent />
            </ConfigContext.Provider>
        );

        fireEvent.click(getByText('Authenticate'));

        expect(window.dispatchEvent).toHaveBeenCalledWith(
            new CustomEvent('LOGORA::authenticationRequired', { detail: { redirectUrl } })
        );
        
        expect(showModal).not.toHaveBeenCalled();
    });
});
