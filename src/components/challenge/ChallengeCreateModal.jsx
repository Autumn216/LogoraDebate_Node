import React, { useState } from 'react';
import AsyncSelect from 'react-select/async';
import { Modal, useModal } from '@logora/debate.dialog.modal';
import { useDataProvider } from '@logora/debate.data.data_provider';
import { useRoutes } from '@logora/debate.context.config_provider';
import { useAuth } from "@logora/debate.auth.use_auth";
import { withAlert } from "../../store/AlertProvider";
import { useIntl } from 'react-intl';
import { FormattedMessage } from 'react-intl';
import { Button } from '@logora/debate.action.button';
import { AuthorBox } from '@logora/debate.user.author_box';
import { AnnouncementIcon } from '@logora/debate.icons';
import { Link } from '@logora/debate.action.link'; 
import Argument from '../Argument';
import { InputProvider } from '@logora/debate.context.input_provider';
import TextEditor from '@logora/debate.input.text-editor';
import cx from 'classnames';
import styles from './ChallengeCreateModal.module.scss';

const ChallengeCreateModal = props => {
	const intl = useIntl();
	const routes = useRoutes();
	const api = useDataProvider();
	const { currentUser } = useAuth();
	const { hideModal } = useModal();
	const [userChoice, setUserChoice] = useState();
	const [isActiveFirst, setIsActiveFirst] = useState(Boolean(userChoice));
	const [isActiveSecond, setIsActiveSecond] = useState(Boolean(userChoice));
	const [positions, setPositions] = useState(props.positions ? props.positions : []);
	const [groupContextId, setGroupContextId] = useState(props.groupContext ? props.groupContext.id : null);
	const [debateOptions, setDebateOptions] = useState([]);
	const [userOptions, setUserOptions] = useState([]);
	const [debate, setDebate] = useState([]);
	const [users, setUsers] = useState([]);
	const [isUserSelected, setIsUserSelected] = useState(false);
	const [selectedUser, setSelectedUser] = useState();
	const [error, setError] = useState(true);
	const [content, setContent] = useState("");
	const [richContent, setRichContent] = useState();
	const positionIndex = props.opponentPosition && props.positions && props.opponentPosition.id === props.positions[0].id ? 1 : 0;

	const userSide = (position, index) => {
		setUserChoice(position);
		if(index === 0) {
			setIsActiveFirst(!isActiveFirst);
			setIsActiveSecond(false);
		} else {
			setIsActiveSecond(!isActiveSecond);
			setIsActiveFirst(false);
		}
	}

	const challengeInvitation = () => {
		let data = {
			group_context_id: groupContextId,
			position_id: userChoice ? positions.find(position => position.id === userChoice).id : positions.find(position => position.id !== props.opponentPosition.id).id, 
			target_id: props.isIndex && isUserSelected ? selectedUser.id : props.opponent.id,
			author_argument_content: content,
			author_argument_rich_content: JSON.stringify(richContent),
		};
		if(props.argument) {
			data = {...data, opponent_argument_id: props.argument.id,};
		} 
		api.create("debate_invitations", data).then(response => {
			if(response.data.success) {
				hideModal();
				props.toastAlert("challenge.invitation_send", "success", "", "", "");
			} else {
				setStatus("ERROR")
			}
		}).catch(error => {
			setStatus("ERROR")
		});
	}

	const displayPosition = (position, index) => {
		return (
			<div className={cx(styles.positionChoice, styles[`position-${index + 1}`], {[styles.isActive]: !isActiveFirst && !isActiveSecond && props.opponentPosition ? props.opponentPosition && (position.id !== props.opponentPosition.id) : index === 0 ? isActiveFirst : isActiveSecond})} onClick={() => userSide(position.id, index)} key={index}>
				{ position && position.name }
			</div>
		)
	}

	const getDebates = async (query) => {
        const res = await api.getList("groups", { page: 1, per_page: 10, query: query, countless: true, sort: "-created_at" });
		if (res.data.success) {
			const data = await res.data.data;
			if (data) {
				setDebateOptions([]);
				data.map(e => {
					debateOptions.push({ value: e.name, label: e.name }),
					debate.push(e);
				});
			}
		}
		return debateOptions;
    };

	const getUsers = async (query) => {
        const res = await api.getList("groups", { page: 1, per_page: 10, query: query, countless: true, sort: "-created_at" });
		if (res.data.success) {
			const data = await res.data.data;
			if (data) {
				setUserOptions([]);
				data.map(e => {
					userOptions.push({value: e.full_name, label: e.full_name}),
					users.push(e);
				});
			}
		}
		return userOptions;
    };

	const handleDebatePromiseOptions = (inputValue) => {
		if (inputValue) {
			return getDebates(inputValue);
		} else {
			return getDebates();
		}
	};

	const handleUsersPromiseOptions = (inputValue) => {
		if (inputValue) {
			return getUsers(inputValue);
		} else {
			return getUsers();
		}
	};

	const selectDebate = (input) => {
		setPositions(debate.find(debate => debate.name === input.value).group_context.positions);
		setGroupContextId(debate.find(debate => debate.name === input.value).group_context.id);
		setUserChoice(null);
		setIsActiveFirst(false);
		setIsActiveSecond(false);
	}

	const selectUser = (input) => {
		setSelectedUser(users.find(user => user.full_name === input.value));
		setIsUserSelected(true);
	}

	const userMessage = (content) => {
		if (!content || (content && content.replace( /\n/g, " " ).split(" ").length < 3 || content == "")) {
            setError(true);
			return false;
        } else {
			setError(false);
			return true;
        }
	}

	const handleContentChange = (content, richContent) => {
		setContent(content);
		setRichContent(richContent);
		userMessage(content);
	}

	return(
		<Modal
			data-vid={"side_modal"}
			title={intl.formatMessage({ id: "challenge.invitation" })}
		>
			<>
				<div className={styles.modalSubtitle}>
					<FormattedMessage id="challenge.invitation.subtitle" />
				</div>
				<div className={styles.sectionTitle}>
					<FormattedMessage id="challenge.create_title" />
				</div>
				{!props.name && 
					<div className={styles.titleInfo}>
						<span><FormattedMessage id="challenge.change_debate" /></span>
					</div>
				}
				<div className={styles.title}>
					<AsyncSelect 
						className={styles.selectForDebate}
						defaultOptions
						loadOptions={handleDebatePromiseOptions}
						onChange={selectDebate}
						defaultValue={{ label: props.name ? props.name : <FormattedMessage id="challenge.debate_choice" />, value: props.name ? props.name : <FormattedMessage id="challenge.debate_choice" /> }}
						isDisabled={props.name}
					/>
				</div>
				{props.opponentPosition ?
					<div className={styles.thesisContainer}>
						<div className={styles.positionBox}>
							<div className={styles.positionItem}>
								<FormattedMessage id="challenge.your_position" />
							</div>
							<div className={cx(styles.positionChoice, styles[`position-${positionIndex + 1}`], styles.isActive, styles.positionChoiceIsArgument)}>
								{ props.positions.find(position => position.name !== props.opponentPosition.name).name }
							</div>
						</div>
					</div>
				:
					<div className={styles.thesisContainer}>
						<div className={styles.positionBox}>
							<div className={styles.positionItem}>
								<FormattedMessage id="challenge.your_side" />
							</div>
						</div>
						<div className={styles.positionBox}>
							<div className={cx(styles.positionItem, styles.positionItemBox)}>
								{positions.length > 0 ? 
								positions.slice(0, 2).map((position, index) => displayPosition(position, index))
								:
								props.positions ? 
									props.positions.slice(0, 2).map((position, index) => displayPosition(position, index))
								:
									<span className={styles.noPositions}><FormattedMessage id="challenge.position_choice" /></span>
								}
							</div>
						</div>
					</div>			
				}
				
				<div className={styles.opponentHeaderContainer}>
					<div className={styles.header}>
						<div className={cx(styles.opponentTitle, styles.sectionTitle)}>
							<FormattedMessage id="challenge.your_opponent" />
						</div>
					</div>
				</div>
				{props.isIndex &&
					<>
						<div className={styles.titleInfo}>
							<span><FormattedMessage id="challenge.change_user" /></span>
						</div>
						<AsyncSelect 
							className={styles.selectForUser}
							loadOptions={handleUsersPromiseOptions}
							onChange={selectUser}
							noOptionsMessage={() => intl.formatMessage({ id: "challenge.no_users" })}
							defaultValue={{ label: <FormattedMessage id="challenge.user_choice" />, value: <FormattedMessage id="challenge.user_choice" /> }}
						/>
					</>
				}
				<div className={cx({[styles.opponentContainer]:!props.argument, [styles.opponentContainerMargin]:!isActiveFirst && !isActiveSecond, [styles.opponentContainerHide]:props.isIndex && !isUserSelected})}>
					{props.isIndex && isUserSelected &&
						<AuthorBox 
							author={selectedUser}
							hideUserInfo={false}
						/>
					}
					{props.opponent && !props.positions &&
						<AuthorBox 
							author={props.opponent}
							hideUserInfo={false}
						/>
					}
					{props.opponent && props.positions &&
						<>
							<div className={styles.argumentContainer}>
								<Argument
									positionIndex={props.positions.map((e) => e.id).indexOf(props.argument.position.id) + 1}
									debateIsActive={true}
									debatePositions={props.positions}
									argumentNoFooter={true}
									argument={props.argument}
									key={props.argument.id}
									expandable={true}
								/>
							</div>
						</>
					}
				</div>
				<div className={cx(styles.sectionTitle, styles.sectionFirstArgument)}>
					<span><FormattedMessage id="challenge.first_argument" /></span>
				</div>
				<div className={styles.argumentInput}>
						<InputProvider>
							<TextEditor
								handleChange={(value, rawValue) => { handleContentChange(value, rawValue);} }
								placeholder={intl.formatMessage({ id: "challenge.first_argument.write" })}
								sources={null}
								hideSubmit={true}
								hideSourceAction={true}
								showStylesControls={true}
							/>
						</InputProvider>
						{currentUser.points < 200 &&
							<div className={styles.inputDisabled}><FormattedMessage id="challenge.user.points" /></div>
						}
				</div>
				{props.opponent && props.opponent.id === currentUser.id && 
					<div className={styles.warningText}>
						<AnnouncementIcon width={16} height={16} />
						<span><FormattedMessage id="challenge.current_user_opponent" /></span>
					</div>
				}
				{props.isIndex && isUserSelected && selectedUser.id === currentUser.id && 
					<div className={styles.warningText}>
						<AnnouncementIcon width={16} height={16} />
						<span><FormattedMessage id="challenge.current_user_opponent" /></span>
					</div>
				}
				{currentUser.points < 200 && 
					<>
						<div className={styles.warningText}>
							<AnnouncementIcon width={16} height={16} />
							<span><FormattedMessage id="challenge.user.points" /></span>
						</div>
						<div className={styles.infoText} onClick={hideModal}>
							<Link to={routes.informationLocation.toUrl()}>
								<FormattedMessage id="info_page.get_points" />
							</Link>
						</div>
					</>
				}
				{error &&
					<div className={styles.warningText}>
						<AnnouncementIcon width={16} height={16} />
						<span><FormattedMessage id="challenge.user_message.error" /></span>
					</div>
				}
				<div className={styles.actionsContainer}>
					<Button disabled={error || currentUser.points < 200 || props.opponent && props.opponent.id === currentUser.id || props.isIndex && selectedUser && selectedUser.id === currentUser.id || !props.opponentPosition && (!isActiveFirst && !isActiveSecond) || props.isIndex && !isUserSelected} className={cx(styles.actionButton, {[styles.buttonDisabled]: error || currentUser.points < 200 || props.opponent && props.opponent.id === currentUser.id || !props.opponentPosition && (!isActiveFirst && !isActiveSecond) || isUserSelected.id === currentUser.id || props.isIndex && !isUserSelected})} handleClick={() => challengeInvitation()}>
						<FormattedMessage id="group_invitation.send.action" />
					</Button>
				</div>
			</>
		</Modal>
	)
}

export default withAlert(ChallengeCreateModal);