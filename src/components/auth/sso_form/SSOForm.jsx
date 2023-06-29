import React from "react";
import { useIntl } from "react-intl";
import { useLocation } from "react-router";
import { NextIcon } from "@logora/debate.icons";
import { Toggle } from "@logora/debate.input.toggle";
import { LinkButton } from '@logora/debate.action.link_button';
import { FormattedMessage } from "react-intl";
import useSessionStorageState from '@rooks/use-sessionstorage-state';
import cx from "classnames";
import styles from "./SSOForm.module.scss";

export const SSOForm = (props) => {
	const [emailConsent, setEmailConsent] = useSessionStorageState("logora:emailConsent", false);
	const intl = useIntl();
	const location = useLocation();

	const getLoginLink = () => {
		if (props.authType == "oauth2_server") {
			return getOAuthDialogUrl(props.loginUrl);
		} else {
			return getLinkWithRedirect(props.loginUrl);
		}
	};

	const getSignupLink = () => {
		if (props.authType == "oauth2_server") {
			return getOAuthDialogUrl(props.signupUrl);
		} else {
			return getLinkWithRedirect(props.signupUrl);
		}
	};

	const getLinkWithRedirect = (url) => {
		if (typeof window !== "undefined") {
			let redirectUrl = url === "CURRENT_LOCATION" ? window.location.origin + location.pathname + location.hash + location.search : url;
			let parsedUrl = new URL(redirectUrl, window.location.origin);
			let params = parsedUrl.searchParams;
			let originalParams = new URLSearchParams(location.search);
			if (props.redirectParameter) {
				params.append(props.redirectParameter, window.location.origin + location.pathname + location.hash + location.search);
			} else {
				params.append("logora_redirect", window.location.origin + location.pathname + location.hash + location.search);
			}
			if (props.trackingParameter && props.trackingValue && originalParams.get("utm_campaign")) {
				const trackingId = props.trackingValue + originalParams.get("utm_campaign");
				params.append(props.trackingParameter, encodeURIComponent(trackingId));
			}
			parsedUrl.search = params.toString();
			return parsedUrl.toString();
		} else {
			return "";
		}
	}

	const getOAuthDialogUrl = (url) => {
		let fullUrl = url;
		if(fullUrl.includes("?")) {
			fullUrl += "&";
		} else {
			fullUrl += "?";
		}
		fullUrl += "client_id=" + encodeURIComponent(props.clientId);
		fullUrl += "&redirect_uri=" + encodeURIComponent(props.oAuthRedirectUri);
		fullUrl += "&scope=" + encodeURIComponent(props.scope);
		fullUrl += "&response_type=code";
		if (typeof window !== "undefined") {
			fullUrl += "&state=" + encodeURIComponent(window.btoa(window.location.href));
		}
		return fullUrl;
	};

	return (
		<div className={styles.ssoForm}>
            <div className={styles.logo}>
                <NextIcon className={styles.loginIcon} />
            </div>
            <div className={styles.mainText}>
				{ props.subtitle &&
					<>
						<strong>
							{ props.subtitle }
						</strong>
						<br />
					</>
				}
				{ intl.formatMessage({ id: 'auth.sso_form.subtitle', defaultMessage: "Sign up right now and receive alerts by email." }) }
			</div>
            <LinkButton
                data-tid={"link_signup"}
				data-testid={"signup-button"}
                className={styles.loginButton}
                to={getSignupLink()}
				external
            >
                { intl.formatMessage({ id: 'auth.sso_form.signup', defaultMessage: 'Sign up' }) }
            </LinkButton>
            <div className={styles.cgu}>
                { intl.formatMessage({ id: 'auth.sso_form.already_account', defaultMessage: "Already have an account ?" }) }
                <a
                    className={styles.signupButton}
					role="link"
					data-testid={"signin-link"}
                    data-tid={"link_login"}
                    rel='nofollow'
                    href={getLoginLink()}
                >
                    { intl.formatMessage({ id: 'auth.sso_form.signin', defaultMessage: 'Sign in' }) }
                </a>
            </div>
            {props.showEmailConsent ? (
                <div className={cx(styles.switchBox)}>
                    <Toggle 
                        type={"checkbox"} 
                        name={"accepts_provider_email"} 
                        role="input"
                        style={{ fontSize: 18 }}
                        checked={emailConsent} 
                        label={ intl.formatMessage({ id: "auth.sso_form.consent_label", defaultMessage: "I agree to receive emails from the editor" }, { variable: props.providerName }) }
                        onInputChanged={(e) => setEmailConsent(!emailConsent)} 
                        data-testid={"accepts-email-input"}
                    />
                </div>
            ) : null}
            { props.error ? (
                <div className={styles.error}>
					{ intl.formatMessage({ id: "auth.sso_form.error", defaultMessage: "An error occurred during sign in. Please try again in a few moments." }) }
				</div>
            ) : null}
            <div className={styles.cguButton}>
                <FormattedMessage
                    id='auth.sso_form.terms'
					defaultMessage="By clicking on « Sign up », I declare that I have read the <var1> General Conditions of Use </var1> of the debate space and accept them"
                    values={{
                        var1: (chunks) => (
                            <a className={styles.termsTarget} target='_blank' href={props.termsUrl}>
                                {chunks}
                            </a>
                        ),
                    }}
                />
            </div>
            <div className={styles.cguButton}>
                <FormattedMessage id='auth.sso_form.data_terms' defaultMessage={"Your personnal data are being processed by the Editor. For more information and to exercise your rights, see our personal data policy available on the site."} />
            </div>
        </div>
	);
}
