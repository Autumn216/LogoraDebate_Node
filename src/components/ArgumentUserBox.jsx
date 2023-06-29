import React, { useState, useEffect } from "react";
import { withConfig } from '@logora/debate.context.config_provider';
import { useIntl } from "react-intl";
import { ArgumentHeader } from '@logora/debate.argument.argument_header';
import VoteButton from "./VoteButton";
import { ShareButton } from '@logora/debate.share.share_button';
import { ChatIcon, UserIcon, ReplyIcon } from '@logora/debate.icons';
import { Tooltip } from '@logora/debate.tools.tooltip';
import { Link } from '@logora/debate.action.link'; 
import { ExpandableText } from '@logora/debate.text.expandable_text';
import { getWinningVote } from "@logora/debate.util.get_winning_vote";
import styles from "./ArgumentUserBox.module.scss";

const ArgumentUserBox = props => {
	const [winningPosition, setWinningPosition] = useState();
	const [totalVotes, setTotalVotes] = useState(0);
	const intl = useIntl();

	useEffect(() => {
		setWinningPosition(getWinningVote(props.argument.group.votes_count, props.argument.group.group_context.positions).winningPositionObj);
		setTotalVotes(getWinningVote(props.argument.group.votes_count, props.argument.group.group_context.positions).totalVotes);
	}, [])

	const getPercentageValue = (voteCount, totalVotes) => {
		if (totalVotes === 0) { return 0; }
		return Math.round(100 * (voteCount / totalVotes));
	};

	const goToArgument = () => {
		if (props.config.routes.router === "hash") { return ( props.routes.debateShowLocation.toUrl({ debateSlug: props.argument.group.slug }) + "/argument_" + props.argument.id);}
		return ( props.routes.debateShowLocation.toUrl({ debateSlug: props.argument.group.slug }) + "/#argument_" + props.argument.id);
	};

	return (
		<div className={styles.argumentUserBox}>
			<Link className={styles.argumentUserBoxReplyAction} tabIndex='0' to={goToArgument()}>
				<div className={styles.argumentUserBoxHeader}>
					<div className={styles.argumentTitleBox}>
						<div className={styles.argumentUserBoxDebateTitle}>{props.argument.group.group_context.name}</div>
					</div>
					<div className={styles.argumentUserBoxHeaderStats}>
						<div className={styles.argumentUserBoxStatItem} title={intl.formatMessage({ id: "info.participants_count" })}>
							<UserIcon width={25} height={30} /> {props.argument.group.participants_count}
						</div>
						<div className={styles.argumentUserBoxStatItem} title={intl.formatMessage({ id: "info.arguments_count" })}>
							<ChatIcon width={25} height={30} {...(props.config.theme.iconTheme === "edge" && {variant: "edge"})} /> {props.argument.group.messages_count}
						</div>
						<div className={styles.argumentUserBoxPercentage}>
							{ winningPosition && (
								<>
									{ getPercentageValue(winningPosition.count, totalVotes) } %{" "}
									{ winningPosition.name }
								</>
							)}
						</div>
					</div>
				</div>
			</Link>
			<div className={styles.argumentUserBoxBody}>
				<ArgumentHeader 
					author={props.argument.author}
					date={props.argument.created_at}
					tag={props.argument.position?.name}
					tagClassName={styles[`headerPosition-${props.argument.group.group_context.positions.map((e) => e.id).indexOf(props.argument.position.id) + 1}`]}
				/>
				<ExpandableText 
					maxHeight={props.contentMaxHeight ? props.contentMaxHeight : 156}
					expandText={intl.formatMessage({ id: "action.read_more" })}
					collapseText={intl.formatMessage({ id: "action.read_less" })}
				>
					<div className={styles.argumentUserBoxContent}>{props.argument.content}</div>
				</ExpandableText>
				<div className={styles.argumentUserBoxFooter}>
					<VoteButton
						voteableType={"Message"}
						voteableId={props.argument.id}
						totalUpvotes={props.argument.upvotes} 
						totalDownvotes={0}
						positionIndex={
							props.argument.group.group_context.positions
								.map((e) => e.id)
								.indexOf(props.argument.position.id) + 1
						}
					/>
					<Link className={styles.argumentUserBoxReplyAction} tabIndex='0' to={goToArgument()}>
						<Tooltip text={intl.formatMessage({ id:"action.reply" })}>
							<ReplyIcon height={22} width={22} />
						</Tooltip>
					</Link>
					<div className={styles.argumentUserBoxShareAction}>
						<ShareButton 
							shareUrl={"https://app.logora.fr/share/a/" + props.argument.id} 
							shareTitle={intl.formatMessage({ id: "share.argument.title" })} 
							shareText={intl.formatMessage({ id: "share.argument.text" })} 
						/>
					</div>
				</div>
			</div>
		</div>
	)
}

export default withConfig(ArgumentUserBox);
