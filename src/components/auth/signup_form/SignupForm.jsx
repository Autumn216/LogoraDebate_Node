import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import { Button } from '@logora/debate.action.button';
import { TextInput } from '@logora/debate.input.text_input';
import { Toggle } from "@logora/debate.input.toggle";
import cx from 'classnames';
import styles from './SignupForm.module.scss';

export const SignupForm = (props) => {
    const [email, setEmail] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [acceptsProviderEmail, setAcceptsProviderEmail] = useState(false);
    const [passwordError, setPasswordError] = useState("");
    const intl = useIntl();

    const handleSubmit = (event) => {
        event.preventDefault();
        if (validatePassword(password, confirmPassword)) {
            if (props.onSubmit) {
                props.onSubmit(firstName, lastName, email, password, confirmPassword, acceptsProviderEmail);
            }
        }
    }

    const validatePassword = (password, confirmPassword) => {
        if (password === confirmPassword) { 
            return true 
        } else { 
            setPasswordError(intl.formatMessage({ id: "auth_signup_form_password_error", defaultMessage: "Password and confirmation are not matching." }))
            return false 
        }
    }

    return (
        <>
            <form onSubmit={handleSubmit} className={styles.signUpForm}>
                <div className={styles.formGroup}>
                    <TextInput 
                        type={"text"} 
                        name={"first_name"} 
                        role="input"
                        placeholder={intl.formatMessage({ id:"auth_signup_form_first_name_placeholder", defaultMessage: "First name" })} 
                        onChange={(e) => setFirstName(e.target.value)}
                        error={props.error}
                        required
                        data-testid={"first-name-input"}
                    />
                </div>
                <div className={styles.formGroup}>
                    <TextInput 
                        type={"text"} 
                        name={"last_name"}
                        role="input"
                        placeholder={intl.formatMessage({ id:"auth_signup_form_last_name_placeholder", defaultMessage: "Last name" })}
                        error={props.error}
                        onChange={(e) => setLastName(e.target.value)}
                        data-testid={"last-name-input"}
                    />
                </div>
                <div className={styles.formGroup}>
                    <TextInput 
                        type={"email"} 
                        name={"email"} 
                        role="input"
                        placeholder={intl.formatMessage({ id:"auth_signup_form_email_placeholder", defaultMessage: "Email" }) } 
                        error={props.error}
                        required
                        onChange={(e) => setEmail(e.target.value)} 
                        data-testid={"email-input"}
                    />
                </div>
                <div className={styles.formGroup}>
                    <TextInput 
                        type={"password"} 
                        name={"password"} 
                        role="input"
                        placeholder={intl.formatMessage({ id:"auth_signup_form_password_placeholder", defaultMessage: "Password"}) }
                        error={props.error || passwordError} 
                        message={passwordError && passwordError}
                        required
                        onChange={(e) => setPassword(e.target.value)} 
                        data-testid={"password-input"}
                    />
                </div>
                <div className={styles.formGroup}>
                    <TextInput 
                        type={"password"} 
                        name={"password_confirmation"} 
                        role="input"
                        placeholder={intl.formatMessage({ id:"auth_signup_form_password_confirmation_placeholder", defaultMessage: "Confirm password" })}
                        error={props.error || passwordError} 
                        required
                        message={props.error ? 
                                        intl.formatMessage({ id:"auth_signup_form_error", defaultMessage: "An error occurred while signing up. Please check your input and try again." })
                                : passwordError ?
                                        passwordError
                                : null}
                        onChange={(e) => setConfirmPassword(e.target.value)} 
                        data-testid={"password-confirmation-input"}
                    />
                </div>
                <div className={styles.formGroup}>
                    <Toggle 
                        type={"checkbox"} 
                        name={"accepts_provider_email"} 
                        role="input"
                        style={{ fontSize: 18 }}
                        checked={acceptsProviderEmail} 
                        label={intl.formatMessage({ id:"auth_signup_form_accepts_email_label", defaultMessage: "I agree to receive emails from the editor" }, { variable: props.providerName } )}
                        onInputChanged={(e) => setAcceptsProviderEmail(!acceptsProviderEmail)} 
                        data-testid={"accepts-email-input"}
                    />
                </div>
                <div className={cx(styles.formGroup, styles.formSubmitGroup)}>
                    <Button className={styles.formSubmitButton} role="button" type="submit" handleClick={() => null}>
                        { intl.formatMessage({ id:"auth_signup_form_submit_label", defaultMessage: "Sign up" }) }
                    </Button>
                </div>
            </form>
        </>
    );
}