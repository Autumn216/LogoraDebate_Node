import { useEffect } from 'react';
import { useAuth } from "@logora/debate.auth.use_auth";
import { useDataProvider } from '@logora/debate.data.data_provider';

export const useUpdateUserConsent = () => {
    const { currentUser, setCurrentUser, isLoggedIn } = useAuth();
    const api = useDataProvider();

    useEffect(() => {
        if(isLoggedIn && currentUser.slug) {
            if(typeof window !== 'undefined' && window.sessionStorage) {
                const emailConsent = window.sessionStorage.getItem("logora:emailConsent");
                if(emailConsent) {
                    updateUserConsent();
                }
            }
        }
    }, [isLoggedIn]);

    const updateUserConsent = () => {
        const data = {
            accepts_provider_email: true
        };
        api.update("users", currentUser.slug, data).then(response => {
            if(response.data.success && response.data.data.resource) {
                setCurrentUser(response.data.data.resource);
            }
        });
    }

    return null;
}