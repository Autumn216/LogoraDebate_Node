import React from 'react';
import OauthPopup from "react-oauth-popup";
import { useLocation } from "react-router";
import styles from './OAuth2Button.module.scss';

export const OAuth2Button = (props) =>  {
    const location = useLocation();

	const onCode = (code, params) => {
		props.onCode(code, props.provider);
	}

	const onClose = () => {
        if(props.onClose) {
            props.onClose();
        }
	}

	const getDialogUrl = () => {
		let baseUrl = new URL(props.authDialogUrl);
		baseUrl.searchParams.append("client_id", props.clientId);
		baseUrl.searchParams.append("redirect_uri", props.redirectUri);
		baseUrl.searchParams.append("scope", props.scope);
		if(props.responseType) {
			baseUrl.searchParams.append("response_type", props.responseType);
		}
		if(typeof window !== 'undefined') {
			baseUrl.searchParams.append("state", window.btoa(window.location.origin + location.pathname + location.hash + location.search));
		}
		return baseUrl.href;
	}

	return (
		<div className={styles.oauthButtonContainer}>
			<OauthPopup
				url={getDialogUrl()}
				onCode={onCode}
				onClose={onClose}
			>
                <div className={styles.oauthPopupContainer}>
                    { props.children }
                </div>
			</OauthPopup>
		</div>
	);
}