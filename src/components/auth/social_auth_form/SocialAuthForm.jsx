import React, { useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import FacebookLoginButton from '@logora/debate.auth.facebook_login_button';
import GoogleLoginButton from '@logora/debate.auth.google_login_button';
import LoginForm from "@logora/debate.auth.login_form";
import SignupForm from "@logora/debate.auth.signup_form";
import { Toggle } from "@logora/debate.input.toggle";
import { MailIcon, ArrowIcon } from '@logora/debate.icons';
import { v4 as uuidv4 } from 'uuid';
import styles from "./SocialAuthForm.module.scss";

export const SocialAuthForm = props => {
	const [mainMenu, setMainMenu] = useState(!(props.lastStep === "LOGIN" || props.lastStep === "SIGNUP"));
	const [loginStep, setLoginStep] = useState(props.lastStep !== "SIGNUP");
	const [acceptsEmails, setAcceptsEmails] = useState(false);
	const intl = useIntl();

	const handleSignUp = (first_name, last_name, email, password, password_confirmation, accepts_provider_email) => {
		const data = {
			uid: uuidv4(),
			first_name: first_name,
			last_name: last_name,
			email: email,
			password: password,
			accepts_provider_email: accepts_provider_email,
			receives_newsletter_email: accepts_provider_email,
		};
		props.onSubmit(data, "form", "SIGNUP");
	};

	const handleLogin = (email, password) => {
		const data = {
			email: email,
			password: password,
		};
		props.onSubmit(data, "password", "LOGIN");
	};

	const handleAuthorizationCode = (code, provider) => {
		props.onSubmit(code, provider, "SOCIAL", acceptsEmails);
	};

	const displayTerms = () => {
		return (
			<div className={styles.formFooterTerms}>
				<FormattedMessage
					id='auth.social_auth_form.terms_text'
					values={{
						var1: (chunks) => (
							<a className={styles.termsLink} target='_blank' href={props.termsUrl}>
								{chunks}
							</a>
						),
						var2: (chunks) => (
							<a className={styles.termsLink} target='_blank' href={props.privacyUrl}>
								{chunks}
							</a>
						),
					}}
					defaultMessage={"By clicking on \"Subscribe\", you confirm that you accept the <var1>General Conditions of Use</var1> and our <var2>Confidentiality Policy</var2> which informs you of the methods of processing your personal data as well as your rights over this data."}
				/>
			</div>
		)
	}

	const displayFooter = () => {
		return (
			<>
				<div className={styles.formFooter}>
					<div className={styles.formFooterRow}>
						<div>{ intl.formatMessage({ id: loginStep ? "auth.social_auth_form.no_account" : "auth.social_auth_form.already_account", defaultMessage: loginStep ? "No account yet ?" : "Already have an account ?"})}</div>&nbsp;
						<div className={styles.formNavigation} onClick={() => setLoginStep(!loginStep)}>
							{ intl.formatMessage({ id: loginStep ? "auth.social_auth_form.signup" : "auth.social_auth_form.login", defaultMessage: loginStep ? "Sign up" : "Sign in" })}
						</div>
					</div>
				</div>
				{ !loginStep && displayTerms() }
			</>
		)
	}

	return (
		<div className={styles.authFormContent}>
			{ mainMenu ?
				<>
					{ props.logoUrl &&
						<img
							className={styles.socialLoginLogo}
							src={props.logoUrl}
							width={200}
							height={50}
							role="img"
							alt={"Logo " + props.providerName}
						/>
					}
					<div className={styles.socialLoginText}>
						{ intl.formatMessage({ id: "auth.social_auth_form.menu_title", defaultMessage: "Create your account in one click to vote and start debating !" }) }
					</div>
					<FacebookLoginButton 
						text={intl.formatMessage({ id: "auth.social_auth_form.facebook_login", defaultMessage: "Sign in with Facebook" })}
						facebookClientId={props.facebookClientId}
						redirectUri={props.oAuthRedirectUri} 
						onCode={handleAuthorizationCode}
					/>
					<GoogleLoginButton 
						text={intl.formatMessage({ id: "auth.social_auth_form.google_login", defaultMessage: "Sign in with Google" })}
						googleClientId={props.googleClientId}
						redirectUri={props.oAuthRedirectUri} 
						onCode={handleAuthorizationCode} 
					/>
					<div className={styles.mailLoginButton} onClick={() => setMainMenu(false)}>
						<MailIcon />
						<div className={styles.textMailLoginButton}>
							{ intl.formatMessage({ id: "auth.social_auth_form.mail_login", defaultMessage: "Sign in with email" }) }
						</div>
					</div>
					{ !loginStep &&
						<div className={styles.checkboxContainer}>
							<Toggle 
								type={"checkbox"} 
								name={"accepts_emails"} 
								role="input"
								style={{ fontSize: 18 }}
								checked={acceptsEmails} 
								label={intl.formatMessage({ id: "auth.social_auth_form.accepts_emails_label", defaultMessage: "I agree to receive emails from the editor" }, { variable: props.providerName } )}
								onInputChanged={(e) => setAcceptsEmails(!acceptsEmails)} 
							/>
						</div>
					}
					{ props.error && props.lastStep === "SOCIAL" ? (
						<div className={styles.errorGroup}>{intl.formatMessage({ id: "auth.social_auth_form.error", defaultMessage: "An error occurred during sign in. Please try again in a few moments." })}</div>
					) : null}
					{ displayFooter() }
				</>
			:
				<>
					<div className={styles.formTitleContainer}>
						<div className={styles.formBackArrow} onClick={() => setMainMenu(true)} data-testid={"back-button"}>
							<ArrowIcon height={25} width={25} />&nbsp;{ intl.formatMessage({ id: "auth.social_auth_form.back_to_menu", defaultMessage: "Back to menu" }) }
						</div>
						<div className={styles.formTitle}>
							{ intl.formatMessage({ id: loginStep ? "auth.social_auth_form.login_title" : "auth.social_auth_form.signup_title", defaultMessage: loginStep ? "Sign in to enter the debate space" : "Get your arguments ready" }) }
						</div>
					</div>
					{ !loginStep ?
						<>
							<div className={styles.signUpSubtitle}>
								{ intl.formatMessage({ id: "auth.social_auth_form.signup_subtitle", defaultMessage: "Sign up in a few clicks to start debating" }) }
							</div>
							<SignupForm 
								onSubmit={handleSignUp} 
								providerName={props.providerName}
								error={props.error && props.lastStep === "SIGNUP"}
							/>
						</>
					:
						<div className={styles.loginFormContainer}>
							<LoginForm 
								onSubmit={handleLogin} 
								error={props.error && props.lastStep === "LOGIN"}
								forgotPasswordUrl={props.forgotPasswordUrl}
							/>
						</div>
					}
					{ displayFooter() }
				</>
			}
		</div>
	);
}