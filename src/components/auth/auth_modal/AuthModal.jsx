import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useConfig } from '@logora/debate.context.config_provider';
import { Modal, useModal } from '@logora/debate.dialog.modal';
import { useAuth, useAuthActions } from "@logora/debate.auth.use_auth";
import useSessionStorageState from '@rooks/use-sessionstorage-state';
import { httpClient } from '@logora/debate.data.axios_client';
import AuthProviderFactory from '@logora/debate.auth.providers';
import SocialAuthForm from '@logora/debate.auth.social_auth_form';
import SSOForm from '@logora/debate.auth.sso_form';
import { Loader } from '@logora/debate.tools.loader';
import styles from "./AuthModal.module.scss";

export const AuthModal = ({ onHideModal = null }) => {
	const config = useConfig();
	const { hideModal } = useModal();
	const { isLoggedIn, authError } = useAuth();
	const [initAuth, setInitAuth] = useState(false);
	const [method, setMethod] = useState(null);
	const [acceptsEmails, setAcceptsEmails] = useSessionStorageState("logora:emailConsent", false);
    const { loginUser } = useAuthActions(httpClient, process.env.API_AUTH_URL, 'logora_user_token');

	useEffect(() => {
		if (isLoggedIn) { 
			hideAuthModal(); 
		}
	}, [isLoggedIn])

	useEffect(() => {
		if (method) { 
			setInitAuth(false); 
		}
	}, [authError])

	const hideAuthModal = () => {
		hideModal();
		if (onHideModal) {
			onHideModal();
		}
	};

	const handleAssertion = (assertion, socialProvider, method, acceptsEmails) => {
		setMethod(method);
		if(acceptsEmails) {
			setAcceptsEmails(true);
		}
		setInitAuth(true);
		
		authenticate(assertion, socialProvider);
	};

	const authenticate = (assertion, socialProvider) => {
		const authProvider = AuthProviderFactory.create(config.auth?.type, config.shortname, assertion, socialProvider);
		const authParams = authProvider.getAuthorizationParams();
		loginUser(authParams);
	}

	return (
		<Modal data-vid={"login_modal"}>
			<div className={styles.loginModalBody}>
				<>
					{initAuth ? (
						<Loader />
					) : (
						<>
							{config.auth.type === "form" || config.auth.type === "social" ? (
								<SocialAuthForm
									onSubmit={handleAssertion}
									error={authError}
									lastStep={method}
									facebookClientId={process.env.FACEBOOK_CLIENT_ID}
									googleClientId={process.env.GOOGLE_CLIENT_ID}
									oAuthRedirectUri={process.env.OAUTH_REDIRECT_URI} 
									logoUrl={config.logo?.desktop}
									providerName={config.provider?.companyName}
									forgotPasswordUrl={"https://admin.logora.fr/?application=" + config.shortname + "#/forgot_password"}
									termsUrl={config.provider?.cguUrl || "http://logora.fr/cgu"}
									privacyUrl={config.provider?.privacyUrl || "http://logora.fr/privacy"}
								/>
							) : (
								<SSOForm 
									authType={config.auth.type}
									error={authError && method === "OAUTH2"}
									oAuthRedirectUri={process.env.OAUTH_REDIRECT_URI}
									clientId={config.auth.clientId}
									scope={config.auth.scope}
									loginUrl={config.auth.login_url}
									signupUrl={config.auth.registration_url || config.auth.login_url}
									redirectParameter={config.auth.redirectParameter}
									trackingParameter={config.auth.trackingParameter}
									trackingValue={config.auth.trackingValue}
									providerName={config.provider && config.provider.companyName}
									showEmailConsent={config.auth.showEmailConsent}
									termsUrl={config.provider && config.provider.cguUrl || "http://logora.fr/cgu"}
								/>
							)}
						</>
					)}
				</>
			</div>
		</Modal>
	);
}

AuthModal.propTypes = {
	/** Callback when modal is closed */
	onHideModal: PropTypes.func
};
  
AuthModal.defaultProps = {
	onHideModal: null
};
  