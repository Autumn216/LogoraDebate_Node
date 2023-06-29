import React, { useState, useRef, lazy, Suspense } from 'react';
import { useModal } from '@logora/debate.dialog.modal';
import { useAuth } from "@logora/debate.auth.use_auth";
import { useDataProvider } from '@logora/debate.data.data_provider';
import { useAuthenticationRequired } from "@logora/debate.hooks.use_authentication_required";
import { useIntl, FormattedMessage } from 'react-intl';
import { withInput } from '../store/InputAndListProvider';
import { withAlert } from '../store/AlertProvider';
import { getSessionStorageItem, setSessionStorageItem } from "../utils/SessionStorage";
import { Avatar } from '@logora/debate.user.avatar';
import { useFormValidation } from '@logora/debate.hooks.use_form_validation';
import styles from './ReplyInput.module.scss';
import TextEditor from './TextEditor';
const SourceModal = lazy(() => import('@logora/debate.source.source_modal'));
const SideModal = lazy(() => import('@logora/debate.modal.side_modal'));

const ReplyInput = (props) => {
	const [sources, setSources] = useState([]);
	const [replyContent, setReplyContent] = useState('');
	const [replyRichContent, setReplyRichContent] = useState(null);
	const [positionId, setPositionId] = useState(null);

	const { showModal } = useModal();
	const requireAuthentication = useAuthenticationRequired();
	const { isLoggedIn, currentUser } = useAuth();
	const { errors, validate } = useFormValidation();
	const api = useDataProvider();
	const intl = useIntl();

	const replyInputForm = useRef(null);
	const replyInputField = useRef(null);

	const showSideModal = () => {
		showModal(
			<Suspense fallback={null}>
				<SideModal
					onChooseSide={handleChooseSide}
					debatePositions={props.debatePositions}
					debateName={props.debateName }
				/>
			</Suspense>
		);
	}

	const handleChange = (editorContent, editorRichContent) => {
		setReplyContent(editorContent);
		setReplyRichContent(editorRichContent);
	}

	const handleFormSubmit = (event) => {
		event.preventDefault();
		if (isLoggedIn) {
			const storedUserSide = JSON.parse(getSessionStorageItem("userSide"));
			if ((storedUserSide) && (storedUserSide.groupId == props.debateId) && !props.isComment) {
				submitReply(storedUserSide.positionId);
			} else if (props.isComment){
				submitReply();
			} else {
				showSideModal();
			}
		} else {
			const prevUserContent = getSessionStorageItem(`userContentReply${props.parentId}`);
			let storedData = JSON.parse(prevUserContent);
			let replyArgumentData = {
				content: replyContent,
				richContent: replyRichContent,
			};
			storedData = Object.assign(storedData, replyArgumentData);
			setSessionStorageItem(`userContentReply${props.parentId}`, JSON.stringify(storedData));
			requireAuthentication({ loginAction: "argument" });
		}
	}

   	const handleChooseSide = (positionId) => {
		setPositionId(positionId);
		submitReply(positionId);
	}

	const handleShowSourceModal = () => {
		if(isLoggedIn) {
			showModal(
				<Suspense fallback={null}>
					<SourceModal onAddSource={handleAddSource} onHideModal={focusEditor} />
				</Suspense>
			);
		} else {
			requireAuthentication({ loginAction: "argument", onHideModal: handleHideModal });
		}
	}
  
	const handleAddSource = (newSource) => {
		setSources([...sources, newSource]);
	}

	const submitReply = (positionId) => {
		const data = {
			content: replyContent,
			rich_content: JSON.stringify(replyRichContent),
			position_id: positionId,
			group_id: props.debateId,
			is_reply: true,
			message_id: props.parentId,
			source_ids: sources.map(source => source.id)
		};
		const replyValidationRules = [
			{ content: ["length", 3] },
			{ content: ["required", null] }
		]
		if (validate(data, replyValidationRules)) {
			if (props.debatePositions && props.debatePositions.map(position => position.id).includes(positionId)) {
				setSessionStorageItem("userSide", JSON.stringify(
				{
					groupId: props.debateId,
					positionId: positionId
				}));
			}
			if (props.groupType) { data["group_type"] = props.groupType }
			resetInputs();
			props.handleReplyTo();
			api.create("messages", data).then(response => {
				if(response.data.success) {
					const reply = response.data.data.resource;
					if(props.showAlert) {
						if (props.isComment) {
							props.toastAlert("alert.comment_create", "success", intl.formatMessage({ id: "alert.reply_gain" }), "", "");
						} else {
							props.toastAlert("alert.argument_create", "success", intl.formatMessage({ id: "alert.reply_gain" }), "", "");
						}
					}
					if(!props.showReplies){
						props.handleToggleReplies();
					}
				}
			});
		}
	}

	const resetInputs = () => {
		setReplyContent("");
		setReplyRichContent(null);
		setSources([]);
		resetEditor();
	}

	const focusEditor = () => {
		replyInputField.current.setFocus();
	}

	const resetEditor = () => {
		replyInputField.current.reset();
	}

    return (
		<div className={styles.replyInputContainer}>
			{ !props.debateIsActive && (
				<div className={styles.disabledInputMask}>
					<FormattedMessage id="intpu.reply_input.reply_is_inactive" defaultMessage={"Debate is closed."} />
				</div>
			)}
			<form data-tid={"form_add_reply"} ref={replyInputForm} onSubmit={handleFormSubmit} className={styles.replyInputForm}>
				<div className={styles.replyEditorRow}>
					<Avatar avatarUrl={currentUser.image_url} userName={currentUser.full_name} className={styles.replyInputAuthorImage} />
					<div className={styles.textEditorBox}>
						<TextEditor
							ref={replyInputField}
							handleChange={handleChange}
							rows={5} 
							placeholder={intl.formatMessage({ id:"input.reply_input.your_answer", defaultMessage: "Your answer" }) }
							sources={sources}
							onAddSource={handleShowSourceModal}
							onSubmit={handleFormSubmit}
							showIcons={true}
							shortBar={true}
							uid={`Reply${props.parentId}`}
							onActivation={() => null}
						/>
						<div className={styles.replyInputWarning}>{errors && Object.values(errors)}</div>
					</div>
				</div>
			</form>
		</div>
    );
}

export default withAlert(withInput(ReplyInput));