import { useEffect } from 'react';
import { useAuth } from "@logora/debate.auth.use_auth";
import { useLocation } from "react-router";
import { useAuthenticationRequired } from "@logora/debate.hooks.use_authentication_required";

export const useUrlInitAuth = () => {
    const { isLoggingIn, isLoggedIn } = useAuth();
    const location = useLocation();
	const requireAuthentication = useAuthenticationRequired();

    useEffect(() => {
        if(isLoggingIn == false && isLoggedIn == false) {
            checkUrl();
        }
    }, [isLoggingIn]);

    const checkUrl = () => {
        if(typeof window !== 'undefined') {
            const urlParams = new URLSearchParams(location.search);
            if (urlParams.get("auth") && urlParams.get("auth") === 'true') {
                requireAuthentication({});
            }
        }
    }

    return null;
}