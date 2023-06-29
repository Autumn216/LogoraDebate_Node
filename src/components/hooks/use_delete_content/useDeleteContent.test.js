import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { useDeleteContent } from './useDeleteContent';
import { useAuth } from "@logora/debate.auth.use_auth";
import { useAuthenticationRequired } from "@logora/debate.hooks.use_authentication_required";
import { useModal } from '@logora/debate.dialog.modal';

jest.mock('@logora/debate.auth.use_auth');
jest.mock('@logora/debate.hooks.use_authentication_required');
jest.mock('@logora/debate.dialog.modal');
jest.mock('@logora/debate.list.list_provider', () => ({ useList: () => ({ remove: jest.fn() }) }));
jest.mock('@logora/debate.data.data_provider', () => ({ useDataProvider: () => ({ delete: jest.fn(() => ({ data: { success: true } })) }) }));
jest.mock('react-intl', () => ({ useIntl: () => ({formatMessage: jest.fn(),}) }));

describe('useDeleteContent', () => {
    beforeEach(() => {
        useAuth.mockReturnValue({ isLoggedIn: true });
        useModal.mockReturnValue({ showModal: jest.fn() });
        useAuthenticationRequired.mockReturnValue(jest.fn());
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should call requireAuthentication if user is not logged in', () => {
        useAuth.mockReturnValue({ isLoggedIn: false });
        const { result } = renderHook(() =>
            useDeleteContent('content', 'contentType', 'listId', 'deleteTitle', 'deleteQuestion', 'deleteAlert')
        );

        act(() => {
            result.current.deleteContent();
        });

        expect(useAuthenticationRequired).toHaveBeenCalledTimes(1);
    });

    it('should call modal if user is logged in', () => {
        const { result } = renderHook(() =>
            useDeleteContent('content', 'contentType', 'listId', 'deleteTitle', 'deleteQuestion', 'deleteAlert')
        );

        act(() => {
            result.current.deleteContent();
        });

        expect(useModal().showModal).toHaveBeenCalledTimes(1);
    });
});
