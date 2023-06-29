import React, { useState, useEffect, useRef, lazy, Suspense } from 'react';
import { useAuth } from "@logora/debate.auth.use_auth";
import { withAlert } from '../store/AlertProvider';
import { withInput } from '../store/InputAndListProvider';
import { useList } from '@logora/debate.list.list_provider';
import { useModal } from '@logora/debate.dialog.modal';
import { useDataProvider } from '@logora/debate.data.data_provider';
import { useResponsive } from "@logora/debate.hooks.use_responsive";
import { useIntl } from 'react-intl';
import { useLocation } from "react-router";
import { useAuthenticationRequired } from "@logora/debate.hooks.use_authentication_required";
import { AuthorBox } from '@logora/debate.user.author_box';
import TextEditor from './TextEditor';
import TextFormatter from '../utils/TextFormatter';
import { getSessionStorageItem, setSessionStorageItem } from "../utils/SessionStorage";
import { AnnouncementIcon } from '@logora/debate.icons';
import { useFormValidation } from '@logora/debate.hooks.use_form_validation';
import cx from 'classnames';
import styles from './ArgumentInput.module.scss';
const SourceModal = lazy(() => import('@logora/debate.source.source_modal'));
const SideModal = lazy(() => import('@logora/debate.modal.side_modal'));

export const defaultAuthor = {
    full_name: <TextFormatter id="default_author.full_name" />,
    points: 1000
}

const ArgumentInput = (props) => {   
    const intl = useIntl();
    const api = useDataProvider();
    const list = useList();
    const { isLoggedIn, currentUser } = useAuth();
    const { errors, validate } = useFormValidation();
    const [isMobile, isTablet, isDesktop] = useResponsive();
    const location = useLocation();
    // REFS
    const inputForm = useRef(null);
    const inputField = useRef(null);
    // STATE
    const [sources, setSources] = useState([]);
    const [argumentContent, setArgumentContent] = useState("");
    const [argumentRichContent, setArgumentRichContent] = useState(null);
    const [positionId, setPositionId] = useState(null);
    const [argumentId, setArgumentId] = useState(null);
    const [flash, setFlash] = useState(false);
    const [inputActivation, setInputActivation] = useState(false);
	const requireAuthentication = useAuthenticationRequired();
	const { showModal } = useModal();

    useEffect(() => {
        getUrlParams();
        if (props.argumentPositionId) {
            setPositionId(props.argumentPositionId);
        }
    }, [])

    useEffect(() => {
        if (props.startInput) {
            scrollToEditor();
            focusEditor();
            props.setStartInput(false);
        }
    }, [props.startInput])

    useEffect(() => {
        if (props.editElement && props.editElement.id) {
            setEditArgument();
        }
    }, [props.editElement])

    const getUrlParams = () => {
        if(typeof window !== 'undefined') {
            const urlParams = new URLSearchParams(location.search);
            // Init argument
            const initFocus = urlParams.get('initArgument');
            // Init Vote
            const initVote = urlParams.get('initVote');
            const positionId = urlParams.get('positionId');
            if (initFocus === 'true') {
                requireAuthentication({ loginAction: "argument" });
                setPositionId(positionId);
                focusEditor();
                flashing();
            }
            if (initVote === 'true') {
                setPositionId(positionId);
            }
        }
    }

    const setEditArgument = () => {
        const richContent = props.editElement.rich_content && JSON.parse(props.editElement.rich_content);
        setSources(props.editElement.sources);
        setArgumentContent(props.editElement.content);
        setArgumentRichContent(richContent);
        setArgumentId(props.editElement.id);
        scrollToEditor();
        setEditorContent(richContent, props.editElement.content);
    }

    const scrollToEditor = () => {
        inputForm.current.scrollIntoView(false);
    }

    const focusEditor = () => {
        inputField.current.setFocus();
    }

    const resetEditor = () => {
        if (inputField) {
            inputField.current.reset();
        }
    }

    const setEditorContent = (richContent, content) => {
       inputField.current.setContent(richContent, content);
    }

    const resetInputs = () => {
       setArgumentContent("");
       setArgumentRichContent(null);
       setPositionId(null);
       setArgumentId(null);
       setSources([]);
       resetEditor();
    }

    const handleHideModal = () => {
       focusEditor();
    }

    const handleShowSourceModal = () => {
        if (isLoggedIn) {
            showModal(
                <Suspense fallback={null}>
                    <SourceModal
                        onAddSource={handleAddSource}
                        onHideModal={handleHideModal}
                    />
                </Suspense>
            )
        } else {
            requireAuthentication({ loginAction: "argument", onHideModal: handleHideModal });
        }
    }

    const showSideModal = (neutral) => {
        showModal(
            <Suspense fallback={null}>
                <SideModal 
                    onChooseSide={handleChooseSide}
                    debatePositions={props.debatePositions}
                    debateName={props.debateName}
                    disabledPositions={props.disabledPositions}
                    isNeutral={neutral}
                />
            </Suspense>
        );
    }

    const handleAddSource = (newSource) => {
        setSources([...sources, newSource]);
    }

    const handleFormSubmit = (event) => {
        event.preventDefault();
        if(isLoggedIn) {
            if (argumentId) {
                updateArgument();
            } else {
                if (props.disabledPositions && props.disabledPositions.length == props.debatePositions.length) {
                    props.toastAlert("info.argument_limit", "error");
                    return;
                }
                if (props.disabledPositions && !props.isComment && props.disabledPositions.length > 0) {
                    showSideModal(false);
                    return;
                }
                const storedUserSide = JSON.parse(getSessionStorageItem("userSide"));
                if (!props.isComment && positionId && (positionId !== (props.debatePositions[2] && props.debatePositions[2].id))) {
                    submitArgument(positionId)
                } else if (!props.isComment && (storedUserSide) && (storedUserSide.groupId == props.debateId) && (storedUserSide.positionId !== (props.debatePositions[2] && props.debatePositions[2].id))) {
                    submitArgument(storedUserSide.positionId);
                } else if (!props.isComment && (storedUserSide) && (storedUserSide.groupId == props.debateId) && (storedUserSide.positionId === (props.debatePositions[2] && props.debatePositions[2].id))
                || positionId && (positionId === (props.debatePositions[2] && props.debatePositions[2].id))) {
                    showSideModal(true);
                } else {
                    if (props.isComment){
                        submitArgument();
                    } else {
                        showSideModal(false);
                    }
                }
            }
        } else {
            requireAuthentication({ loginAction: "argument" });
        }
    }

    const handleChooseSide = (positionId) => {
        setPositionId(positionId);
        submitArgument(positionId);
    }

    const handleChange = (editorContent, editorRichContent) => {
        setArgumentContent(editorContent);
        setArgumentRichContent(editorRichContent);
    }

    const submitArgument = (positionId) => {
        const data = {
            content: argumentContent,
            rich_content: JSON.stringify(argumentRichContent),
            position_id: positionId,
            group_id: props.debateId,
            is_reply: false,
            message_id: null,
            source_ids: sources && sources.map(source => source.id),
        };

        const argumentValidationRules = [
            { content: ["length", 3] },
			{ content: ["required", null] }
        ]
       
        if (validate(data, argumentValidationRules)) {
            if (props.debatePositions && props.debatePositions.map(position => position.id).includes(positionId)) {
                setSessionStorageItem("userSide", JSON.stringify(
                {
                    groupId: props.debateId,
                    positionId: positionId
                }));
            }
            if (props.groupType) { data["group_type"] = props.groupType }
            resetInputs();
            api.create("messages", data).then(response => {
                if(response.data.success) {
                    const argument = response.data.data.resource;
                    let listId = "";
                    if (props.isMobileInput) {
                        listId = "argumentListMobile";
                    } else {
                        if(props.isComment) {
                            listId = "commentList";
                        } else {
                            listId = `argumentList${argument.position.id}`;
                        }
                    }
                    if (props.onAddArgument) {
                        props.onAddArgument(argumentContent, props.debatePositions.find(pos => pos.id === positionId));
                    }
                    list.add(listId, [argument]);
                    if(props.isComment) {
                        props.toastAlert("alert.comment_create", "success", intl.formatMessage({ id: "alert.argument_create_gain" }), "ARGUMENT", currentUser.messages_count === 2 ? "alert.third_argument" : "alert.first_argument");
                    } else {
                        props.toastAlert("alert.argument_create", "success", intl.formatMessage({ id: "alert.argument_create_gain" }), "ARGUMENT", currentUser.messages_count === 2 ? "alert.third_argument" : "alert.first_argument");
                    }
                }
            });
        }
    }

    const updateArgument = () => {
        const data = {
            content: argumentContent,
            rich_content: JSON.stringify(argumentRichContent),
            source_ids: sources && sources.map(source => source.id)
        };
        props.setEditElement({});
        api.update("messages", argumentId, data).then(response => {
            if(response.data.success) {
                const argument = response.data.data.resource;
                let listId = "";
                if (props.isMobileInput) {
                    listId = "argumentListMobile";
                } else {
                    if(props.isComment) {
                        listId = "commentList";
                    } else {
                        listId = `argumentList${argument.position.id}`;
                    }
                }
                list.update(listId, [argument]);
                if (props.isComment) {
                    props.toastAlert("alert.comment_modify", "success", "", "", "");
                } else {
                    props.toastAlert("alert.argument_modify", "success", "", "", "");
                }
                resetInputs();
            }
        });
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

    const handleTextEditorActivation = () => {
        setInputActivation(true);
    }

    const displayArgumentLimitWarning = () => {
        if (props.disabledPositions.length === props.debatePositions.length) { 
            return intl.formatMessage({ id: "info.argument_input_limit" });
        } else {
            const disabledPosition = props.disabledPositions[0];
            return  <TextFormatter id={"info.argument_side_limit"} variables={{ variable: disabledPosition.name }} />
        }
    }

    return (
        <>
            { props.disabled && (<div className={styles.disabledInputMask}>{ intl.formatMessage({ id: "info.debate_is_inactive" }) }</div>) }
            <div className={cx(styles.argumentInput, { [styles.flash]: flash })}>
                <div className={styles.argumentInputContainer}>
                    <form data-tid={"action_add_argument"} ref={inputForm} className={styles.argumentInputForm}>
                        <div className={styles.argumentInputBox}>
                            <div className={cx(styles.argumentTextInputBox, {[styles.argumentTextInputBoxisTablet]: !isMobile})}>
                                <div className={styles.argumentAuthorContainer}>
                                    <AuthorBox
                                        author={Object.keys(currentUser).length === 0 ? defaultAuthor : currentUser} 
                                        hideUserInfo={inputActivation}
                                    />
                                </div>
                                <div className={styles.textEditorBox}>
                                    <TextEditor 
                                        ref={inputField} 
                                        handleChange={handleChange} 
                                        rows={5}
                                        placeholder={props.isComment ? intl.formatMessage({ id:"alt.comment_input" }) : intl.formatMessage({ id:"alt.argument_input" }) }
                                        onAddSource={handleShowSourceModal}
                                        onSubmit={handleFormSubmit}
                                        sources={sources}
                                        hideSourceAction={props.hideSourceAction}
                                        uid={`Argument${props.debateId}`}
                                        onActivation={handleTextEditorActivation}
                                        showIcons={true}
                                        disabled={props.disabled}
                                    />
                                    <div className={styles.argumentInputWarning}>{errors && Object.values(errors)}</div>
                                    {props.disabledPositions && props.disabledPositions.length > 0 && inputActivation &&
                                        <div className={styles.argumentInputWarning}>
                                            <AnnouncementIcon className={styles.warningIcon} height={20} width={20} /> 
                                            <div className={styles.argumentInputWarningText}>{displayArgumentLimitWarning()}</div>
                                        </div>
                                    }
                                </div>
                            </div>
                            
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

export default withAlert(withInput(ArgumentInput));