import React, { useState, useEffect } from 'react';
import { useConfig } from '@logora/debate.context.config_provider';
import { useDataProvider } from '@logora/debate.data.data_provider';
import { withLoading } from '@logora/debate.tools.with_loading';
import { withInput } from "../store/InputAndListProvider";
import { withAuth } from "@logora/debate.auth.use_auth";
import { useIntl } from "react-intl";
import { CommentContext } from '@logora/debate.comment.comment_context';
import VotePaginatedList from './VotePaginatedList';
import ArgumentInput from './ArgumentInput';
import { ArgumentBlankBox } from '@logora/debate.argument.argument_blank_box';
import { DebateRelatedList } from '@logora/debate.debate.debate_related_list';
import { useLocation } from "react-router-dom";
import UserContentSkeleton from '@logora/debate.skeleton.user_content_skeleton';
import Argument from './Argument';
import styles from './Comments.module.scss';

const Comments = (props) => {
	const intl = useIntl();
	const config = useConfig();
    const [source, setSource] = useState();
	const [extraCommentId, setExtraCommentId] = useState(undefined);
	const [extraCommentsArray, setExtraCommentsArray] = useState([]);
	const [currentFilter, setCurrentFilter] = useState();
	const location = useLocation();
	const api = useDataProvider();

    useEffect(() => {
		const { articleUid } = props.match.params;
		loadSource(articleUid);
		if (typeof window !== "undefined") {
			let pageAnchor = location.pathname + location.hash.slice(1);
			const result = pageAnchor.split("argument_");
			if (result.length > 1) {
				let commentId = result[1];
				setExtraCommentId(commentId);
				setCurrentFilter({...currentFilter, argument_id: commentId });
			}
		}
	}, [])

    const loadSource = (sourceUid) => {
		api.getOne("sources", sourceUid, {}).then(
			response => {
				if(response.data.success) {
					const source = response.data.data.resource;
					setSource(source);
					props.setIsLoading(false);
				} else {
					setLoadError(true);
				}
			}).catch(
				error => {
					setLoadError(true);
			});
	}

	const getSortOptions = () => {
		const sortOptions = [];
		sortOptions.push({ value: "-score", type: "sort", name: "relevance", dataTid: "action_sort_comments_relevant", text: intl.formatMessage({id: "info.sort_by_relevance" }) });
		sortOptions.push({ value: "-created_at", type: "sort", name: "recent", dataTid: "action_sort_commentss_recent", text: intl.formatMessage({id: "info.sort_by_newest" }) });
		sortOptions.push({ value: "+created_at", type: "sort", name: "old", dataTid: "action_sort_comments_old", text: intl.formatMessage({id: "info.sort_by_oldest" }) });
		return sortOptions;
	}

	const getRepliesThread = (newComments) => {
		let currentExtraComment = newComments.filter((arg) => arg.id == extraCommentId)[0] || null;
		if (currentExtraComment) {
			let newArray = [...extraCommentsArray, currentExtraComment];
			while (currentExtraComment.reply_to_id) {
				currentExtraComment = newComments.filter((arg) => arg.id == currentExtraComment.reply_to_id)[0] || null;
				newArray.push(currentExtraComment);
			}
			setExtraCommentsArray(newArray);
		}
	};

	const transformComments = (comment) => {
		if (comment.is_reply === true) { return; }
		if (comment.status === "rejected" || comment.status === "pending") { 
			if (comment.author.id === props.currentUser.id) {
				return comment;
			} else {
				return;
			}
		}
		return comment;
	}

  return (
    <>
        { props.isLoading ? 
			null 
		:
			<>
				<div className={styles.commentContainer}>
					<CommentContext source={source} />
					<ArgumentInput
						debateSlug={source.uid}
						debateId={source.id}
						debateName={source.title}
						isMobileInput={props.isMobile}
						showAlert={true}
						isComment={true}
						groupType={"Source"}
					/>
					<div className={styles.commentHeader}>
						<span className={styles.titleHeader}>
							{ intl.formatMessage({ id: "comment.title" }) }
						</span>
					</div>
					<VotePaginatedList 
						voteableType={"Message"}
						currentListId={"commentList"}
						display={"column"}
						resourcePropName="argument"
						perPage={10}
						resource={`sources/${source.uid}/messages`}
						searchBar={false}
						sortOptions={getSortOptions()}
						filters={currentFilter}
						transformData={(comment) => transformComments(comment)}
						onElementsLoad={(newComments) => getRepliesThread(newComments)}
						loadingComponent={<UserContentSkeleton />}
						emptyListComponent={
							<ArgumentBlankBox
								handleClick={() => props.setStartInput(true)}
							/>
						}
					>
						<Argument 
							debateName={source.title}
							debateSlug={source.uid}
							debateIsActive={true}
							displayAd={config.ads.display}
							nestingLevel={props.enableReplies === false ? 4 : 0}
							isComment={true}
							replies={extraCommentsArray.length > 0 && extraCommentsArray}
						/>
					</VotePaginatedList>
					<DebateRelatedList latestDebates />
				</div>
			</>
        }
    </>
  )
}

export default withAuth(withInput(withLoading(Comments)));