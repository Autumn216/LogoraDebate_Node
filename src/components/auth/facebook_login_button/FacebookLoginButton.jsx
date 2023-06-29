import React from 'react';
import OAuth2Button from '@logora/debate.auth.oauth2_button';
import { FacebookLoginIcon } from '@logora/debate.icons';
import styles from './FacebookLoginButton.module.scss';

export const FacebookLoginButton = (props) => {
  return (
    <OAuth2Button 
      authDialogUrl={"https://www.facebook.com/v9.0/dialog/oauth"}
      clientId={props.facebookClientId}
      scope={"email,public_profile"}
      onCode={props.onCode}
      onClose={props.onClose}
      provider={"facebook"}
      redirectUri={props.redirectUri}
    >
      <div className={styles.facebookButton}>
        <FacebookLoginIcon className={styles.facebookButtonIcon} />&nbsp;
        <span>
          { props.text }
        </span>
      </div>
    </OAuth2Button>
  );
}