import { useAuth, useAuthToken } from "@logora/debate.auth.use_auth";
import { useDataProvider } from '@logora/debate.data.data_provider';

export const useAuthActions = (httpClient, authUrl, tokenKey) => {
    const { removeToken, fetchToken } = useAuthToken(httpClient, authUrl, tokenKey);
    const { setCurrentUser, setIsLoggedIn, setIsLoggingIn, setAuthError } = useAuth();
    const api = useDataProvider();

    const loginUser = (authParams) => {
        fetchToken(authParams).then(response => {
            fetchUser();
        }).catch(error => {
            setAuthError(error);
        });
    }

    const logoutUser = () => {
        setIsLoggedIn(false);
        setIsLoggingIn(false);
        setCurrentUser({});
        removeToken();
    }

    const fetchUser = () => {
        api.getOneWithToken('me', '').then(response => {
            if(response.data.success) {
                const currentUser = response.data.data.resource;
                setCurrentUser(currentUser);
                setIsLoggedIn(true);
                setIsLoggingIn(false);
            } else {
                setAuthError(true);
                setIsLoggedIn(false);
                setIsLoggingIn(false);
            }
        }).catch(error => {
            setAuthError(true);
        });
    }

    return {
        loginUser,
        logoutUser,
        fetchUser
    };
}