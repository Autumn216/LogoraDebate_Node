import React, { lazy, Suspense } from "react";
import { Dropdown } from '@logora/debate.tools.dropdown';
import { withConfig } from '@logora/debate.context.config_provider';
import { withAuth } from "@logora/debate.auth.use_auth";
import { withInput } from "../store/InputAndListProvider";
import { useModal } from '@logora/debate.dialog.modal';
import { useReportContent } from "@logora/debate.hooks.use_report_content";
import { useAuthenticationRequired } from "@logora/debate.hooks.use_authentication_required";
import { FormattedMessage, useIntl } from "react-intl";
import VoteButton from "./VoteButton";
import { Avatar } from '@logora/debate.user.avatar';
import { ReplyIcon, EllipsisIcon, VersusIcon } from '@logora/debate.icons';
import { ShareButton } from '@logora/debate.share.share_button';
import TextFormatter from "../utils/TextFormatter";
import { Tooltip } from '@logora/debate.tools.tooltip';
const ChallengeCreateModal = lazy(() => import('./challenge/ChallengeCreateModal'));
import cx from "classnames";
import styles from "./ArgumentFooter.module.scss";

const ArgumentFooter = (props) => {
	const intl = useIntl();
	const { showModal } = useModal();
	const requireAuthentication = useAuthenticationRequired();
	const { reportContent } = useReportContent("Message", props.argument.id, intl.formatMessage({ id: "header.report" }));

	const openCreateModal = (name, positions, opponent, groupContext, opponentPosition, argument) => {
		if(props.isLoggedIn) {
			showModal(
				<Suspense fallback={null}>
					<ChallengeCreateModal
						name={name}
						positions={positions}
						opponent={opponent}
						groupContext={groupContext}
						opponentPosition={opponentPosition}
						argument={argument}
					/>
				</Suspense>
			);
		} else {
			requireAuthentication({});
		}
	}

	const currentUserIsAuthor = () => {
		return props.argument.author.id === props.currentUser.id;
	};

	const handleEditArgument = () => {
		props.setEditElement(props.argument);
	};

	return (
		<>
			<div className={cx(cx(styles.argumentFooter, {[styles.commentArgumentFooter]: props.isComment}))}>
				<div className={styles.argumentVoteAction}>
					<VoteButton
						voteableType={"Message"}
						voteableId={props.argument.id}
						totalUpvotes={props.argument.upvotes} 
						totalDownvotes={0}
						positionIndex={props.positionIndex}
					/>
				</div>
				{props.replyEnabled && <>
					<div className={cx({[styles.argumentCommentReply]: props.isComment})}>
						<Tooltip text={intl.formatMessage({ id:"action.reply" })}>
							<div
								className={styles.argumentReplyAction}
								tabIndex='0'
								onClick={props.handleReplyTo}
							>
								<ReplyIcon data-tid={"action_reply_argument"} height={22} width={22} />
								{props.isComment &&
									<span className={styles.commentReplyText}>Répondre</span>
								}
							</div>
						</Tooltip>
					</div>
					{props.config.modules.challenges && !props.argument.is_reply && !props.isComment &&
						<Tooltip text={intl.formatMessage({ id:"info.view_more_challenges" })}>
							<div data-tid={"action_create_challenge_argument"} className={styles.createChallenge} onClick={() => openCreateModal(props.debateName, props.debatePositions, props.argument.author, props.debateGroupContext, props.argument.position, props.argument)}>
								<VersusIcon width={22} height={22} />
							</div>
						</Tooltip>
					}
				</>}
				{!props.isComment &&
					<ShareButton 
						shareUrl={"https://app.logora.fr/share/a/" + props.argument.id} 
						shareTitle={ intl.formatMessage({ id: "share.argument.title"}) }
						shareText={ intl.formatMessage({ id: "share.argument.text"}) }
						showShareCode 
						shareCode={'<iframe src="https://api.logora.fr/embed.html?shortname=' + props.config.shortname + '&id=' + props.argument.id + '&resource=argument" frameborder="0" width="100%" height="275px" scrolling="no"></iframe>'}
					/>
				}
				<div className={styles.argumentMoreAction} title={intl.formatMessage({ id: "alt.more" })}>
					<Dropdown dropdownListRight={true} closeOnContentClick={true}>
						<EllipsisIcon width={25} height={25} />
						<div>
							{currentUserIsAuthor() && props.debateIsActive ? (
								<>
									<div
										data-tid={"action_edit_argument"}
										className={styles.dropdownItem}
										tabIndex='0'
										onClick={handleEditArgument}
									>
										<TextFormatter id='action.update' />
									</div>
									<div
										data-tid={"action_delete_argument"}
										className={styles.dropdownItem}
										tabIndex='0'
										onClick={props.handleDeleteArgument}
									>
										<TextFormatter id='action.delete' />
									</div>
								</>
							) : null}
							{ props.currentUser.is_banned !== true &&
								<div
									data-tid={"action_report_argument"}
									className={styles.dropdownItem}
									onClick={reportContent}
								>
									<TextFormatter id='action.report' />
								</div>
							}
						</div>
					</Dropdown>
				</div>
			</div>
			{props.numberReplies > 0 && !props.hideReplies ? (
				<div className={cx(styles.argumentFooterReplies, {[styles.commentArgumentFooterReplies]: props.isComment})} onClick={props.handleToggleReplies}>
					{ props.repliesAuthors.map((author, index) => 
						<Avatar key={index} avatarUrl={author.image_url} userName={author.full_name} size={25} />
					)}
					<div
						className={styles.argumentShowRepliesAction}
						title={intl.formatMessage({ id: "alt.see_answers" })}
					>
						<button
							tabIndex='0'
							className={
								props.expandReplies
									? cx(styles.argumentShowRepliesActionButton, styles.active)
									: styles.argumentShowRepliesActionButton
							}
						>
							{props.expandReplies ? (
								<FormattedMessage
									id={props.numberReplies === 1 ? "alt.hide_answer" : "alt.hide_answers_number"}
									values={{ variable: props.numberReplies }}
								/>
							) : (
								<FormattedMessage
									id={props.numberReplies === 1 ? "alt.see_answers" : "alt.see_answers_number"}
									values={{ variable: props.numberReplies }}
								/>
							)}
						</button>
					</div>
				</div>
			) : null}
		</>
	);
}

export default withConfig(withAuth(withInput(ArgumentFooter)));
