import React from 'react';
import OAuth2Button from '@logora/debate.auth.oauth2_button';
import { GoogleIcon } from '@logora/debate.icons';
import styles from './GoogleLoginButton.module.scss';

export const GoogleLoginButton = (props) => {
    return (
        <OAuth2Button 
            authDialogUrl={"https://accounts.google.com/o/oauth2/v2/auth"}
            clientId={props.googleClientId}
            responseType={"code"}
            scope={"https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile"}
            onCode={props.onCode}
            onClose={props.onClose}
            provider={"google"}
            redirectUri={props.redirectUri}
        >
            <div className={styles.googleLoginContainer}>
                <GoogleIcon className={styles.googleLoginIcon} />&nbsp;
                <span>
                    { props.text }
                </span>
            </div>
        </OAuth2Button>
    )
}