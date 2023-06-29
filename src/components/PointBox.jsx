import React from "react";
import styles from "./PointBox.module.scss";
import { PointIcon, VersusIcon, SuggestionCircleIcon, UpvoteCircleIcon, ChatIcon } from '@logora/debate.icons';
import TextFormatter from "../utils/TextFormatter";
import { useRelativeTime } from '@logora/debate.hooks.use_relative_time';
import { Link } from "react-router-dom";
import { withConfig } from '@logora/debate.context.config_provider';
import cx from 'classnames';

const PointBox = (props) => {
    const PointsType = {
        Argument: "create_message",
        Reply: "create_reply",
        Proposal: "create_proposal",
        Suggestion: "accept_debate_suggestion",
        Challenge: "finish_challenge",
        ArgumentSupport: "get_message_vote",
        ReplySupport: "get_message_vote",
        ProposalSupport: "get_proposal_vote",
        SuggestionSupport: "vote_debate_suggestion",
        DebateVote: "vote_group",
    }

    const relativeTime = useRelativeTime(new Date(props.activity.created_at).getTime());

    const getContent = () => {
        const activity = props.activity;
		switch (activity.category) {
			case PointsType["Argument"]:
                if (activity.target.group_type === "Source") { 
                    return (
                        <>
                            <b>+<TextFormatter id="info.point_eloquence" variables={{variable: activity.quantity}} count={activity.quantity} /></b>
                            {" "}
                            <PointIcon width={17} height={17} />
                            {" "}
                            <span><TextFormatter id="activity.comment_create" /></span>
                            {" "}
                            <Link to={goToArgument()}>
                                <b className={styles.textLink}>{activity.target.group.title}</b>
                            </Link>
                        </>
                    );
                }
                return (
                    <>
                        <b>+<TextFormatter id="info.point_eloquence" variables={{variable: activity.quantity}} count={activity.quantity} /></b>
                        {" "}
                        <PointIcon width={17} height={17} />
                        {" "}
                        <span><TextFormatter id="activity.argument_create" /></span>
                        {" "}
                        <Link to={goToArgument()}>
                            <b className={styles.textLink}>{activity.target.group.name}</b>
                        </Link>
                    </>
                );
				
			case PointsType["Reply"]:
                if (activity.target.group_type === "Source") {
                    return (
                        <>
                            <b>+<TextFormatter id="info.point_eloquence" variables={{variable: activity.quantity}} count={activity.quantity} /></b>
                            {" "}
                            <PointIcon width={17} height={17} />
                            {" "}
                            <span><TextFormatter id="activity.reply_comment_create" /></span>
                            {" "}
                            <Link to={goToArgument()}>
                                <b className={styles.textLink}>{activity.target.group.title}</b>
                            </Link>
                        </>
                    );
                } else {
                    return (
                        <>
                            <b>+<TextFormatter id="info.point_eloquence" variables={{variable: activity.quantity}} count={activity.quantity} /></b>
                            {" "}
                            <PointIcon width={17} height={17} />
                            {" "}
                            <span><TextFormatter id="activity.reply_create" /></span>
                            {" "}
                            <Link to={goToArgument()}>
                                <b className={styles.textLink}>{activity.target.group.name}</b>
                            </Link>
                        </>
                    );
                }
				
            case PointsType["Proposal"]:
                return (
                    <>
                        <b>+<TextFormatter id="info.point_eloquence" variables={{variable: activity.quantity}} count={activity.quantity} /></b>
                        {" "}
                        <PointIcon width={17} height={17} />
                        {" "}
                        <span><TextFormatter id="activity.proposal_create" /></span>
                        {" "}
                        <Link to={goToProposal()}>
                            <b className={styles.textLink}>{activity.target.consultation.title}</b>
                        </Link>
                    </>
                );
				
            case PointsType["Suggestion"]:
				return (
                    <>
                        <b>+<TextFormatter id="info.point_eloquence" variables={{variable: activity.quantity}} count={activity.quantity} /></b>
                        {" "}
                        <PointIcon width={17} height={17} />
                        {" "}
                        <span><TextFormatter id="activity.suggestion" /></span>
                        {" "}
                        <Link to={props.routes.suggestionLocation.toUrl()}>
                            <b className={styles.textLink}>{activity.target.name}</b>
                        </Link>
                        {" "}
                        <span><TextFormatter id="activity.suggestion_selected" /></span>
                    </>
				);

            case PointsType["Challenge"]:
				return (
                    <>
                        <b>+<TextFormatter id="info.point_eloquence" variables={{variable: activity.quantity}} count={activity.quantity} /></b>
                        {" "}
                        <PointIcon width={17} height={17} />
                        {" "}
                        <span><TextFormatter id="activity.challenge_finish" /></span>
                        {" "}
                        <Link to={props.routes.challengeShowLocation.toUrl({challengeSlug: activity.target.slug})}>
                            <b className={styles.textLink}>{activity.target.name}</b>
                        </Link>
                    </>
				);

            case PointsType["ArgumentSupport"]:
                return (
                    <>
                        <b>+<TextFormatter id="info.point_eloquence" variables={{variable: activity.quantity}} count={activity.quantity} /></b>
                        {" "}
                        <PointIcon width={17} height={17} />
                        {" "}
                        {activity.quantity > 10 ?
                            <span><TextFormatter id="activity.argument_support_plural" /></span>
                        :
                            <span><TextFormatter id="activity.argument_support" /></span>
                        }
                        {" "}
                        <Link to={goToArgument()}>
                            <b className={styles.textLink}>{activity.target.group.name}</b>
                        </Link>
                    </>
                );
				
            case PointsType["ReplySupport"]:
                return (
                    <>
                        <b>+<TextFormatter id="info.point_eloquence" variables={{variable: activity.quantity}} count={activity.quantity} /></b>
                        {" "}
                        <PointIcon width={17} height={17} />
                        {" "}
                        {activity.quantity > 10 ?
                            <span><TextFormatter id="activity.reply_support_plural" /></span>
                        :
                            <span><TextFormatter id="activity.reply_support" /></span>
                        }
                        {" "}
                        <Link to={goToArgument()}>
                            <b className={styles.textLink}>{activity.target.group.name}</b>
                        </Link>
                    </>
                );
				
            case PointsType["ProposalSupport"]:
                return (
                    <>
                        <b>+<TextFormatter id="info.point_eloquence" variables={{variable: activity.quantity}} count={activity.quantity} /></b>
                        {" "}
                        <PointIcon width={17} height={17} />
                        {" "}
                        {activity.quantity > 10 ?
                            <span><TextFormatter id="activity.proposal_support_plural" /></span>
                        :
                            <span><TextFormatter id="activity.proposal_support" /></span>
                        }
                        {" "}
                        <Link to={goToProposal()}>
                            <b className={styles.textLink}>{activity.target.consultation.title}</b>
                        </Link>
                    </>
                );
				
            case PointsType["SuggestionSupport"]:
				return (
                    <>
                        <b>+<TextFormatter id="info.point_eloquence" variables={{variable: activity.quantity}} count={activity.quantity} /></b>
                        {" "}
                        <PointIcon width={17} height={17} />
                        {" "}
                        <span><TextFormatter id="activity.suggestion_support" /></span>
                    </>
				);

            case PointsType["DebateVote"]:
				return (
                    <>
                        <b>+<TextFormatter id="info.point_eloquence" variables={{variable: activity.quantity}} count={activity.quantity} /></b>
                        {" "}
                        <PointIcon width={17} height={17} />
                        {" "}
                        <span><TextFormatter id="activity.debate_vote" /></span>
                    </>
				);
                
			default:
				return null;
		}
	};

    const getImage = () => {
        const activity = props.activity;
        switch(activity.category) {
            case PointsType["Challenge"]:
                return <VersusIcon width={33} height={33} />;
            case PointsType["Suggestion"]:
                return <SuggestionCircleIcon width={33} height={33} />;
            case PointsType["SuggestionSupport"]:
                return <SuggestionCircleIcon width={33} height={33} />;
            case PointsType["ArgumentSupport"]:
                return <UpvoteCircleIcon width={33} height={33} />;
            case PointsType["ReplySupport"]:
                return <UpvoteCircleIcon width={33} height={33} />;
            case PointsType["ProposalSupport"]:
                return <UpvoteCircleIcon width={33} height={33} />;
            case PointsType["DebateVote"]:
                return <UpvoteCircleIcon width={33} height={33} />;
            default:
                return <ChatIcon width={33} height={33} {...(props.config.theme.iconTheme === "edge" && {variant: "edge"})} />;
        }
    };

    const goToArgument = () => {
        if (props.activity.category === "get_message_vote") {
            if (props.config.routes.router === "hash") { return ( props.routes.debateShowLocation.toUrl({ debateSlug: props.activity.target.group.slug }) + "/argument_" + props.activity.target.id);}
            return ( props.routes.debateShowLocation.toUrl({ debateSlug: props.activity.target.group.slug }) + "/#argument_" + props.activity.target.id);
        }
        if (props.activity.target.group.current_phase) {
            if (props.config.routes.router === "hash") { return ( props.routes.challengeShowLocation.toUrl({ challengeSlug: props.activity.target.group.slug }));}
            return ( props.routes.challengeShowLocation.toUrl({ challengeSlug: props.activity.target.group.slug }));
        } 
        if (props.activity.target.group_type === "Source") {
            if (props.config.routes.router === "hash") { return ( props.routes.commentShowLocation.toUrl({ articleUid: props.activity.target.group.uid }) + "/argument_" + props.activity.target.id);}
            return ( props.routes.commentShowLocation.toUrl({ articleUid: props.activity.target.group.uid }) + "/#argument_" + props.activity.target.id);
        } else {
            if (props.config.routes.router === "hash") { return ( props.routes.debateShowLocation.toUrl({ debateSlug: props.activity.target.group.slug }) + "/argument_" + props.activity.target.id);}
            return ( props.routes.debateShowLocation.toUrl({ debateSlug: props.activity.target.group.slug }) + "/#argument_" + props.activity.target.id);
        }
	};

    const goToProposal = () => {
		if (props.config.routes.router === "hash") { return ( props.routes.consultationShowLocation.toUrl({ consultationSlug: props.activity.target.consultation.slug }) + "/proposal_" + props.activity.target.id);}
		return ( props.routes.consultationShowLocation.toUrl({ consultationSlug: props.activity.target.consultation.slug }) + "/#proposal_" + props.activity.target.id);
	};

    return (
        <>
        { props.activity.target !== null ?
            <div className={styles.container}>
                <div className={styles.imageContainer}>
                    {getImage()}
                </div>
                <div className={styles.textContainer}>
                        {getContent()}
                        <div className={styles.timeAgo}>
                            { relativeTime }
                        </div>
                </div>
            </div>
        :
            null
        }
            
        </>
    )
}

export default withConfig(PointBox);