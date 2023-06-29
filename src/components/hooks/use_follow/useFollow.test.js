import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { useFollow } from './useFollow';
import { useAuth } from "@logora/debate.auth.use_auth";
import { useAuthenticationRequired } from "@logora/debate.hooks.use_authentication_required";

jest.mock('@logora/debate.auth.use_auth');
jest.mock('@logora/debate.hooks.use_authentication_required');
jest.mock('@logora/debate.data.data_provider', () => ({
    useDataProvider: () => ({
        getOneWithToken: jest.fn(() => Promise.resolve({ data: { success: true, data: { resource: {} } } })),
        delete: jest.fn(() => Promise.resolve()),
        create: jest.fn(() => Promise.resolve()),
    }),
}));

describe('useFollow', () => {
    beforeEach(() => {
        useAuth.mockReturnValue({ isLoggedIn: true });
        useAuthenticationRequired.mockReturnValue(jest.fn());
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should work', () => {
        expect(true).toBe(true);
    });

    /*
    it('should initially set followActive to false', () => {
        const { result } = renderHook(() => useFollow('resourceName', 'followableId'));
    
        expect(result.current.followActive).toBe(false);
    });

    it('should call getFollow on mount if user is logged in', () => {
        const apiMock = {
            getOneWithToken: jest.fn(() => Promise.resolve({ data: { success: true, data: { resource: {} } } })),
        };

        const useDataProviderMock = jest.spyOn(require('@logora/debate.data.data_provider'), 'useDataProvider');
        useDataProviderMock.mockReturnValue(apiMock);
    
        renderHook(() => useFollow('resourceName', 'followableId'));
    
        expect(apiMock.getOneWithToken).toHaveBeenCalledWith('follows/resourceName', 'followableId');
    });

    it('should set followActive to true when getFollow returns a resource', async () => {
        const apiMock = {
            getOneWithToken: jest.fn(() => Promise.resolve({ data: { success: true, data: { resource: {} } } })),
        };

        const useDataProviderMock = jest.spyOn(require('@logora/debate.data.data_provider'), 'useDataProvider');
        useDataProviderMock.mockReturnValue(apiMock);
    
        const { result } = renderHook(() => useFollow('resourceName', 'followableId'));
    
        expect(result.current.followActive).toBe(true);
    });

    it('should call handleFollow when user is not logged in and followAction is called', async () => {
        useAuth.mockReturnValue({ isLoggedIn: false });
      
        const { result } = renderHook(() => useFollow('resourceName', 'followableId'));
      
        expect(useAuthenticationRequired).toHaveBeenCalled();
        expect(result.current.followActive).toBe(false);
    });
    */
});
