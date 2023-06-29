import React,  { useState, useRef, useEffect } from 'react';
import { useIntl } from "react-intl";
import { useDataProvider } from '@logora/debate.data.data_provider';
import { withAuth } from "@logora/debate.auth.use_auth";
import { useRoutes } from '@logora/debate.context.config_provider';
import { withInput } from "../store/InputAndListProvider";
import { withAlert } from "../store/AlertProvider";
import { useList } from '@logora/debate.list.list_provider';
import { useAuthenticationRequired } from "@logora/debate.hooks.use_authentication_required";
import { Button } from '@logora/debate.action.button';
import { setSessionStorageItem, getSessionStorageItem, removeSessionStorageItem } from "../utils/SessionStorage";
import { PointIcon, QuestionIcon } from '@logora/debate.icons';
import { Link } from '@logora/debate.action.link';
import { useFormValidation } from '@logora/debate.hooks.use_form_validation';
import TextFormatter from "../utils/TextFormatter";
import AnnouncementDialog from '@logora/debate.dialog.announcement_dialog';
import cx from 'classnames';
import styles from './SuggestionInput.module.scss';

const SuggestionInput = (props) => {
    const intl = useIntl();
    const api = useDataProvider();
    const list = useList();
    const routes = useRoutes();
    const { errors, validate } = useFormValidation();
    const [active, setActive] = useState(true);
    const [flash, setFlash] = useState(false);
    const [suggestion, setSuggestion] = useState("");
    const suggestionInputContainer = useRef(null);
    const inputForm = useRef(null);
	const requireAuthentication = useAuthenticationRequired();

    useEffect(() => {
        let storedSuggestion = getSessionStorageItem(`userSuggestion`);
        if (storedSuggestion) {
            setActive(true);
            const data = JSON.parse(storedSuggestion);
            setSuggestion(data.suggestion);
        }
    }, [])

    useEffect(() => {
        if (active) {
            const saveContent = setInterval(() => {
                if (suggestion.length > 0) {
                    let sessionUserSuggestion = {
                        suggestion: suggestion
                    };
                    setSessionStorageItem(`userSuggestion`, JSON.stringify(sessionUserSuggestion));
                }
            }, 1000);
            return () => clearInterval(saveContent);
        }
    }, [active, suggestion])

    useEffect(() => {
        if(props.startInput) {
            scrollToEditor();
            focusEditor();
            flashing();
            props.setStartInput(false);
        }
    }, [props.startInput])

    const scrollToEditor = () => {
        inputForm.current.scrollIntoView({ behavior: 'smooth'});
    }

    const focusEditor = () => {
        inputForm.current.focus();
    }

    const flashing = () => {
        if(!flash) {
            setFlash(true);
            const timer = setTimeout(() => {
              setFlash(false);
            }, 2000);
            return () => clearTimeout(timer);
        }
    }

    const resetEditor = () => {
        setSuggestion("");
        removeSessionStorageItem(`userSuggestion`);
    }

    const handleSubmit = () => {
        if (props.isLoggedIn) {
            const data = {
                name: suggestion,
                position_list: "Oui,Non",
            };
            const suggestionValidationRules = [
                { name: ["length", 3] },
                { name: ["maxLength", 140] },
			    { name: ["question", null] }
            ]
            if (validate(data, suggestionValidationRules)) {
                setSuggestion("");
                resetEditor();
                setActive(false);
                api.create("debate_suggestions", data).then(response => {
                    if(response.data.success) {
                        const suggestion = response.data.data.resource;
                        list.add("suggestionsList", [suggestion]);
                        props.toastAlert("alert.suggestion_create", "success", "", "", "");
                        props.checkUserSuggestionsCount();
                    }
                });
            }
        } else {
            requireAuthentication({});
        }
    };

    return (
        <div className={styles.suggestionInputContainer} ref={suggestionInputContainer}>
            {props.disabled && props.isLoggedIn &&
                <AnnouncementDialog fullWidth className={styles.annoucementSuggestion}>
                    <div className={styles.pointsRestriction}>
                        <span className={styles.pointsText}><TextFormatter id="info.suggestion.points" /></span>
                        <span className={styles.userPoints}><TextFormatter id="info.point_eloquence" count={100} variables={{variable: 100}} /></span>
                        <PointIcon width={18} height={18} />
                    </div>
                    <div className={styles.pointsRestriction}>
                        <span className={styles.userPoints}><TextFormatter id="info.user_points" />{props.currentUser.points}</span>
                        <PointIcon width={18} height={18} />
                    </div>
                    <Link to={routes.informationLocation.toUrl()}>
					    <div className={styles.pointsInformations}>
						    <QuestionIcon width={17} height={17} />
						    <span><TextFormatter id="info.points" /></span>
						</div>
					</Link>
                </AnnouncementDialog>
            }
            {props.userSuggestionsCount >= 5 && props.isLoggedIn &&
                <AnnouncementDialog fullWidth className={styles.annoucementSuggestion}>
                    <div className={styles.pointsRestriction}>
                        <span className={styles.pointsText}><TextFormatter id="info.suggestion.limit" /></span>
                    </div>
                </AnnouncementDialog>
            }
            <div className={cx(styles.suggestionInputItem, {[styles.suggestionInputDisabled]: props.disabled || props.userSuggestionsCount >= 5})}>
                <div className={styles.suggestionInputTitle}>
                    <TextFormatter id="suggestion.input_title" />
                </div>
                <input 
                    ref={inputForm}
                    type={"text"}
                    className={errors?.name ? cx(styles.suggestionInputError, styles.suggestionInput) : cx(styles.suggestionInput, {[styles.suggestionInputIsDisabled]: props.disabled}, {[styles.flash]: flash })}
                    name="suggestionInput" 
                    onChange={(e) => {setSuggestion(e.target.value);}} 
                    placeholder={intl.formatMessage({ id:"suggestion.input_placeholder" })} 
                    value={suggestion} 
                    required 
                    disabled={props.disabled || props.userSuggestionsCount >= 5}
                />
                <div className={styles.suggestionInputWarning}>{errors?.name}</div>
                <div className={styles.suggestionInputSubtitle}>
                    <TextFormatter id="suggestion.input_info" />
                </div>
            </div>
            <div className={cx({[styles.suggestionInputDisabled]: props.disabled})}>
                {props.disabled ?
                    <Button className={styles.suggestionInputSubmit}>
                        <TextFormatter id="action.submit"/>
                    </Button>
                :
                    <Button handleClick={() => handleSubmit()} className={styles.suggestionInputSubmit}>
                        <TextFormatter id="action.submit"/>
                    </Button>
                }
                
            </div>
        </div>
    )
}

export default withAlert(withAuth(withInput(SuggestionInput)));