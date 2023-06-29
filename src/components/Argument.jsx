import React, { Suspense, lazy, useEffect, useState } from "react";
import { withAuth } from "@logora/debate.auth.use_auth";
import { useConfig } from '@logora/debate.context.config_provider';
import { withAlert } from "../store/AlertProvider";
import { useModal } from '@logora/debate.dialog.modal';
import { useDataProvider } from '@logora/debate.data.data_provider';
import { useResponsive } from '@logora/debate.hooks.use_responsive';
import { useList } from '@logora/debate.list.list_provider';
import { withRouter } from "react-router";
import { useIntl } from "react-intl";
import { ArgumentHeader } from '@logora/debate.argument.argument_header';
import { ExpandableText } from '@logora/debate.text.expandable_text';
import { ChatIcon } from '@logora/debate.icons';
import { ConfirmModal } from "@logora/debate.modal.confirm_modal";
import { getSessionStorageItem } from "../utils/SessionStorage";
import ArgumentFooter from "./ArgumentFooter";
import SourceListItem from "@logora/debate.source.source_list_item";
import VotePaginatedList from "./VotePaginatedList";
const ReplyInput = lazy(() => import('./ReplyInput'));
import cx from "classnames";
import { lexicalToHtml } from "@logora/debate.input.text-editor/lexicalToHtml";
import draftToHtml from "draftjs-to-html";
import UserContentSkeleton from '@logora/debate.skeleton.user_content_skeleton';
import styles from "./Argument.module.scss";

const Argument = (props) => {
	const [expandReplies, setExpandReplies] = useState(false);
	const [flash, setFlash] = useState(false);
	const [startReplyInput, setStartReplyInput] = useState(false);
	const [richContent, setRichContent] = useState(null);
	const [replies, setReplies] = useState([]);
	const { showModal } = useModal();
	const [isMobile, isTablet, isDesktop] = useResponsive();
	const intl = useIntl();
	const config = useConfig();
	const api = useDataProvider();
	const list = useList();
	const componentId = "argument_" + props.argument.id;

	useEffect(() => {
        if (props.argument.rich_content) {
            const rawContent = JSON.parse(props.argument.rich_content);
            if(rawContent.hasOwnProperty("root")) {
                const html = lexicalToHtml(rawContent);
                setRichContent(html);
            } else {
                const htmlContent = draftToHtml(rawContent);
                setRichContent(htmlContent);
            }
        }
    }, [props.argument.rich_content]);

	useEffect(() => {
		if (typeof window !== "undefined") {
			let pageAnchor = props.location.pathname + props.location.hash.slice(1);
			const argumentId = componentId;
			const argumentRegex = /argument_\d+/;
			const argumentAnchor = pageAnchor.match(argumentRegex);
			const argumentReply = getSessionStorageItem(`userContentReply${props.argument.id}`);
			if (argumentReply) {
				scrollToArgument(argumentId);
				setStartReplyInput(true);
			}
			if (argumentAnchor) {
				if (argumentAnchor[0] === argumentId) {
					scrollToArgument(argumentId);
				}
			}
			if (props.replies) {
				displayRepliesThread();
			}
		}
	}, [])
	
	useEffect(() => {
		if (props.replies !== undefined) { displayRepliesThread() }
	}, [props.replies])

	const scrollToArgument = (argumentId) => {
		const currentArgumentId = componentId;
		if (currentArgumentId === argumentId) {
			let argumentElement = document.getElementById(argumentId);
			if (argumentElement) {
				argumentElement.scrollIntoView({behavior: "smooth"});
			}
			setFlash(true);
		}
	};

	const displaySource = (source, index) => {
		return <SourceListItem key={index} publisher={source.publisher} url={source.source_url} title={source.title} index={index} />;
	};

	const toggleReplyInput = () => {
		setStartReplyInput(!startReplyInput);
	};

	const toggleReplies = () => {
		setExpandReplies(!expandReplies);
	};

	const handleDeleteArgument = () => {
		if (props.isLoggedIn) {
			showModal(
				<Suspense fallback={null}>
					<ConfirmModal
						title={props.isComment ? intl.formatMessage({ id: "info.delete_comment" }) : intl.formatMessage({ id: "info.delete_argument" })}
						question={props.isComment ? intl.formatMessage({ id: "info.confirm_delete_comment" }) : intl.formatMessage({ id: "info.confirm_delete_argument" })}
						confirmLabel={intl.formatMessage({ id: "info.yes" })}
						cancelLabel={intl.formatMessage({ id: "info.no" })}
						onConfirmCallback={handleConfirmDeleteArgument}
					/>
				</Suspense>
			);
		}
	};

	const handleConfirmDeleteArgument = () => {
		if (isMobile) {
			list.remove("argumentListMobile", [props.argument]);
		} else if (props.isComment) {
			list.remove("commentList", [props.argument]);
		} else {
			list.remove(`argumentList${props.argument.position.id}`, [props.argument]);
		}
		if (props.isComment) {
			props.toastAlert("alert.comment_delete", "success", "", "", "");
		} else {
			props.toastAlert("alert.argument_delete", "success", "", "", "");
		}
		api.delete("messages", props.argument.id).then((response) => {
			if (response.data.success) {
				// NOTHING
			}
		});
	};

	const displayRepliesThread = () => {
		let filteredReplies = props.replies && props.replies.filter((reply) => reply.reply_to_id == props.argument.id);
		if (filteredReplies.length > 0) {
			setExpandReplies(true);
			setReplies(filteredReplies);
		}
	};

	return (
		<>
			<div
				className={cx(
					styles.argument,
					{ 
						[styles.flash]: flash, 
						[styles.argumentReply]: props.argument.is_reply == true, 
					},
					styles[`level-${props.nestingLevel}`],
					styles[`position-${props.debatePositions && props.debatePositions.map((e) => e.id).indexOf(props.argument.position.id) + 1}`]
				)}
				id={componentId}
			>
				<ArgumentHeader
					author={props.argument.author}
					tag={props.argument.position?.name}
					date={props.argument.created_at}
					tagClassName={styles[`headerPosition-${props.debatePositions && props.debatePositions.map((e) => e.id).indexOf(props.argument.position.id) + 1}`]}
					disableLinks={props.disableLinks}
				/>
				<div className={cx(styles.argumentBody, { [styles.fixedHeight]: props.fixedContentHeight, [styles.challengeBannerArgument]: props.challengeBannerArgument, [styles.commentArgument]: props.isComment })}>
					{ props.argument.is_reply && props.replyToArgument && 
						<div className={styles.replyTo} onClick={() => props.flashParent(props.replyToArgument.id)}>
							{ intl.formatMessage({ id: "info.replying_to" }) }
							<span className={styles.replyingTo}>
								{props.replyToArgument.author.full_name}
								<ChatIcon height={16} {...(config.theme.iconTheme === "edge" && {variant: "edge"})} />
							</span>
						</div> 
					}
					<ExpandableText
						expandable={props.expandable}
						expandText={intl.formatMessage({ id: "action.read_more" })}
						collapseText={intl.formatMessage({ id: "action.read_less" })}
						{...(props.argument.is_reply ? {backgroundColor: config.theme.textTertiary} : {})}
					>
						{richContent ? (
							<div
								className={styles.argumentContent}
								dangerouslySetInnerHTML={{ __html: richContent }}
							></div>
						) : (
							<div className={styles.argumentContent}>{props.argument.content}</div>
						)}
					</ExpandableText>
				</div>
				{(!props.argument.sources || props.argument.sources.length === 0) ? null : (
					<div className={styles.argumentSourcesList}>{props.argument.sources.map(displaySource)}</div>
				)}
				{!props.argumentNoFooter &&
					<ArgumentFooter
						replyEnabled={props.nestingLevel <= 2 ? true : false}
						debateIsActive={props.debateIsActive}
						repliesAuthors={props.argument.replies_authors}
						argument={props.argument}
						positionIndex={props.debatePositions && props.debatePositions.map((e) => e.id).indexOf(props.argument.position.id) + 1}
						numberReplies={props.argument.number_replies}
						expandReplies={expandReplies}
						handleToggleReplies={toggleReplies}
						handleDeleteArgument={handleDeleteArgument}
						handleReplyTo={toggleReplyInput}
						hideReplies={props.hideReplies}
						debatePositions={props.debatePositions && props.debatePositions}
						debateName={props.debateName}
						debateGroupContext={props.debateGroupContext}
						isComment={props.isComment}
					/>
				}
			</div>
			{startReplyInput && !props.hideReplies && (
				<Suspense fallback={null}>
					<ReplyInput
						key={`Reply${props.argument.id}`}
						debateIsActive={props.debateIsActive}
						debatePositions={props.debatePositions && props.debatePositions}
						debateName={props.debateName}
						showAlert={true}
						parentId={props.argument.id}
						debateId={props.argument.group_id}
						handleReplyTo={toggleReplyInput}
						handleToggleReplies={toggleReplies}
						addReplies={() => {}}
						groupType={props.isComment && "Source"}
						isComment={props.isComment}
					/>
				</Suspense>
			)}
			{expandReplies ? (
				<VotePaginatedList
					voteableType={"Message"}
					currentListId={"argument_" + props.argument.id + "_reply_list"}
					loadingComponent={<UserContentSkeleton />}
					resource={"/messages/" + props.argument.id + "/replies"}
					sort={"+created_at"}
					perPage={5}
					display={"column"}
					transformData={elm => (elm.status === "accepted" || elm.author.id === props.currentUser.id)}
					resourcePropName={'argument'}
					extraElement={replies && replies[0]}
				>
					<ArgumentContainer 
						positionIndex={props.debatePositions && props.debatePositions.map((e) => e.id).indexOf(props.argument.position.id) + 1}
						nestingLevel={props.nestingLevel + 1}
						debateIsActive={props.debateIsActive}
						debateName={props.debateName}
						debatePositions={props.debatePositions && props.debatePositions}
						handleDeleteArgument={handleDeleteArgument}
						replies={props.replies}
						replyToArgument={props.argument}
						flashParent={(argumentId) => scrollToArgument(`argument_${argumentId}`)}
						isComment={props.isComment}
					/>
				</VotePaginatedList>
			) : null}
		</>
	);
}

const ArgumentContainer = withRouter(withAlert(withAuth(Argument)));

export default withRouter(withAlert(withAuth(Argument)));
