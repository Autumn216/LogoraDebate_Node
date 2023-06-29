import React from 'react';
import { useRelativeTime } from '@logora/debate.hooks.use_relative_time';
import { useRoutes } from '@logora/debate.context.config_provider';
import { withAuth } from "@logora/debate.auth.use_auth";
import { withRouter } from 'react-router-dom';
import { useDataProvider } from '@logora/debate.data.data_provider';
import { useIntl } from 'react-intl';
import { withAlert } from "../store/AlertProvider";
import TextFormatter from '../utils/TextFormatter';
import { SuggestionCircleIcon, PointIcon, VersusIcon } from '@logora/debate.icons';
import ChallengeInvitationNotification from './challenge/ChallengeInvitationNotification';
import ChallengeFinishedNotification from './challenge/ChallengeFinishedNotification';
import cx from 'classnames';
import styles from './Notification.module.scss';

const NotificationType = {
	GroupReply: "group_reply",
	ChallengeReply: "challenge_reply",
	CommentReply: "comment_reply",
	Followed: "followed",
	GetBadge: "get_badge",
	GetVote: "get_vote",
	GroupFollowArgument: "group_follow_argument",
	GroupInvitation: "group_invitation_new",
    ChallengeInvitation: "debate_invitation_new",
	SuggestionPublished: "debate_suggestion_published",
	SuggestionSupported: "debate_suggestion_supported",
    ChallengeInvitationAccept: "debate_invitation_accepted",
    ChallengeFinished: "debate_finished",
};

const Notification = (props) => {
    const intl = useIntl();
    const routes = useRoutes();
    const api = useDataProvider();
    const relativeTime = useRelativeTime(new Date(props.notification.created_at).getTime());

    const handleClick = (type) => {
        if(typeof window !== 'undefined') {
            props.history.push({
                pathname: getRedirectUrl(),
                search: getRedirectSearch(),
                hash: getRedirectHash(),
                state: { prevPath: true }
            });
        }
        if (props.notification.is_opened == false) {
            const notificationId = props.notification.id;
            api.create(`notifications/read/${notificationId}`, {}).then(response => {
                null;
            }).catch(error => {
                null;
            })
        }
    }

    const handleKeyDown = (event) => {
        const ENTER_KEY = 13;
        if(event.keyCode == ENTER_KEY){
            handleClick(props.linkType);
        }
    }

    const getImage = () => {
        const notification = props.notification;
        switch(notification.notify_type) {
            case NotificationType["SuggestionPublished"]:
                return <SuggestionCircleIcon width={50} height={50} />
            case NotificationType["SuggestionSupported"]:
                return <SuggestionCircleIcon width={50} height={50} />
            case NotificationType["ChallengeInvitation"]:
                return <div className={styles.notificationChallengePoints}>
                    <img data-tid={"action_view_notification"} className={styles.notificationImage} width="50" height="50" title={getImageTitle()} src={getImageUrl()} alt={getImageTitle()} />
                    <div className={styles.challengeIcon}><VersusIcon width={20} height={20} /></div>
                    <div className={styles.userPoints}>
                        { intl.formatNumber(notification.actor.points, { notation: 'compact', maximumFractionDigits: 1, roundingMode: "floor" }) }
                        <PointIcon width={13} height={13} />
                    </div>
                </div>
            case NotificationType["ChallengeInvitationAccept"]:
                return <div className={styles.notificationChallengePoints}>
                    <img data-tid={"action_view_notification"} className={styles.notificationImage} width="50" height="50" title={getImageTitle()} src={getImageUrl()} alt={getImageTitle()} />
                    <div className={styles.challengeIcon}><VersusIcon width={20} height={20} /></div>
                </div>
            case NotificationType["ChallengeFinished"]:
                return <VersusIcon width={50} height={50} />
            default:
                return <img data-tid={"action_view_notification"} className={styles.notificationImage} width="50" height="50" title={getImageTitle()} src={getImageUrl()} alt={getImageTitle()} />
        }
    }

    const getTime = () => {
        const notification = props.notification;
        switch(notification.notify_type) {
            case NotificationType["ChallengeInvitation"]:
                return null
            default:
                return relativeTime;
        }
    }

    const getImageUrl = () => {
        const notification = props.notification;
        switch(notification.notify_type) {
            case NotificationType["GetBadge"]:
                return notification.second_target.icon_url;
            case NotificationType["ChallengeInvitationAccept"]:
                return notification.second_target.target.image_url;
            default:
                return notification.actor.image_url;
        }
    }

    const getRedirectUrl = () => {
        const notification = props.notification;
        switch (notification.notify_type) {
			case NotificationType["GroupReply"]:
				return routes.debateShowLocation.toUrl({ debateSlug: notification.second_target.slug });
            case NotificationType["CommentReply"]:
				return routes.commentShowLocation.toUrl({ articleUid: notification.second_target.uid });
            case NotificationType["ChallengeReply"]:
                return routes.challengeShowLocation.toUrl({ challengeSlug: notification.second_target.slug });
            case NotificationType["GetVote"]:
                if(notification.second_target.is_public) {
                    return routes.debateShowLocation.toUrl({ debateSlug: notification.second_target.slug });
                } else {
                    return routes.challengeShowLocation.toUrl({ challengeSlug: notification.second_target.slug });
                }
            case NotificationType["GroupFollowArgument"]:
                return routes.debateShowLocation.toUrl({ debateSlug: notification.second_target.slug });
            case NotificationType["GroupInvitation"]:
                return routes.debateShowLocation.toUrl({ debateSlug: notification.third_target.slug });
            case NotificationType["SuggestionPublished"]:
                return routes.debateShowLocation.toUrl({ debateSlug: notification.second_target.slug });
            case NotificationType["SuggestionSupported"]:
                return routes.debateShowLocation.toUrl({ debateSlug: notification.second_target.slug });
            case NotificationType["ChallengeInvitation"]:
                if (notification.second_target.debate) {
                    return routes.challengeShowLocation.toUrl({ challengeSlug: notification.second_target.debate.slug });
                }
                break;
            case NotificationType["ChallengeInvitationAccept"]:
                return routes.challengeShowLocation.toUrl({ challengeSlug: notification.target.slug });
            case NotificationType["ChallengeFinished"]:
                return routes.challengeShowLocation.toUrl({ challengeSlug: notification.target.slug });
            default: 
                return routes.userShowLocation.toUrl({ userSlug: props.currentUser.slug });
        }
    }

    const getRedirectHash = () => {
        const notification = props.notification;
        switch (notification.notify_type) {
            case NotificationType["GroupReply"]:
                return "argument_" + notification.target.id;
            case NotificationType["CommentReply"]:
                return "argument_" + notification.target.id;
            case NotificationType["ChallengeReply"]:
                return "argument_" + notification.target.id;
            case NotificationType["GetVote"]:
                return "argument_" + notification.target.voteable_id;
            case NotificationType["GroupFollowArgument"]:
                return "argument_" + notification.target.id;
            case NotificationType["GroupInvitation"]:
                return "invitation_id=" + notification.second_target.uid;
            case NotificationType["GetBadge"]:
                return "badges";
            default: 
                return undefined;
        }
    }

    const getRedirectSearch = () => {
        const notification = props.notification;
        switch (notification.notify_type) {
            case NotificationType["GroupInvitation"]:
                return "invitation_id=" + notification.second_target.uid;
            default: 
                return undefined;
        }
    }

    const getImageTitle = () => {
        const notification = props.notification;
        switch(notification.notify_type) {
            case NotificationType["GetBadge"]:
                return notification.second_target.title;
            case NotificationType["ChallengeInvitationAccept"]:
                return notification.second_target.target.full_name;
            default:
                return notification.actor.full_name;
        }
    }

    const getContent = () => {
        const notification = props.notification;
		switch (notification.notify_type) {
			case NotificationType["GroupReply"]:
				return (
                    <>
                        <b>{notification.actor.full_name}</b>{" "}
                        {notification.actor_count > 1 ? (
                            <>
                                {" "}
                                <TextFormatter id='info.and' /> {notification.actor_count - 1}{" "}
                                <TextFormatter id='notifications.multiple_answers' count={notification.actor_count - 1} />
                            </>
                        ) : (
                            <>
                                <TextFormatter id='notifications.answer' />
                            </>
                        )}{" "}
                        <TextFormatter id='notifications.subject' /> <b>{notification.second_target.name}</b>
                    </>
				);
            case NotificationType["CommentReply"]:
				return (
                    <>
                        <b>{notification.actor.full_name}</b>{" "}
                        {notification.actor_count > 1 ? (
                            <>
                                {" "}
                                <TextFormatter id='info.and' /> {notification.actor_count - 1}{" "}
                                <TextFormatter id='notifications.multiple_answers' count={notification.actor_count - 1} />
                            </>
                        ) : (
                            <>
                                <TextFormatter id='notifications.answer' />
                            </>
                        )}{" "}
                        <TextFormatter id='notifications.subject_comment' /> <b>{notification.second_target.title}</b>
                    </>
				);
			case NotificationType["ChallengeReply"]:
				return (
                    <>
                        <b>{notification.actor.full_name}</b> <TextFormatter id='notifications.challenge_reply' />{" "}
                        <TextFormatter id='notifications.challenge_subject' /> <b>{notification.second_target.name}</b>
                    </>
				);
			case NotificationType["Followed"]:
				return ( <><b>{notification.actor.full_name}</b> <TextFormatter id='notifications.followed' /></> );
			case NotificationType["GetBadge"]:
				return (<><TextFormatter id='notifications.new_badge' variables={{variable: notification.second_target.level}} /> <b>{intl.formatMessage({ id: `badge.${notification.second_target.name}.title` }) }</b></>);
			case NotificationType["GetVote"]:
				return (
                    <>
                        <b>{notification.actor.full_name}</b>
                        {notification.actor_count > 1 ? (
                            <>
                                {" "}
                                <TextFormatter id='info.and' /> {notification.actor_count - 1}{" "}
                                <TextFormatter id='notifications.multiple_support' count={notification.actor_count - 1} />
                            </>
                        ) : (
                            <>
                                {" "}
                                <TextFormatter id='notifications.support' />
                            </>
                        )}{" "}
                        <TextFormatter id='notifications.subject_argument' />
                    </>
				);
			case NotificationType["GroupFollowArgument"]:
				return (
                    <>
                        <b>{notification.actor.full_name}</b>
                        {notification.actor_count > 1 ? (
                            <>
                                {" "}
                                <TextFormatter id='info.and' /> {notification.actor_count - 1}{" "}
                                <TextFormatter id='notifications.multiple_participations' />
                            </>
                        ) : (
                            <>
                                {" "}
                                <TextFormatter id='notifications.participation' />
                            </>
                        )}{" "}
                        <TextFormatter id='notifications.subject_debate' /> <b>{notification.second_target.name}</b>
                    </>
				);
			case NotificationType["GroupInvitation"]:
				return (
                    <>
                        <b>{notification.actor.full_name}</b> <TextFormatter id='notifications.group_invitation_action' />{" "}
                        <TextFormatter id='notifications.subject_debate' /> <b>{notification.third_target.name}</b>
                    </>
				);
            case NotificationType["ChallengeInvitation"]:
				return (
                    <ChallengeInvitationNotification notification={notification} onClick={props.onNotificationClick} />
				);
            case NotificationType["SuggestionPublished"]:
                return (
                    <>
                        <TextFormatter id='suggestion.input_title' /> <b>{notification.second_target.name}</b>{" "}
                        <TextFormatter id='notification.published_suggestion' />
                    </>
                );
            case NotificationType["SuggestionSupported"]:
                return (
                    <>
                        <TextFormatter id='notification.suggestion' /> <b>{notification.second_target.name}</b>{" "}
                        <TextFormatter id='notification.supported_suggestion' />
                    </>
                );
            case NotificationType["ChallengeInvitationAccept"]:
                return (
                    <>
                        <b>{notification.second_target.target.full_name}</b>{" "}
                        <TextFormatter id="challenge.invitation_accepted" />{" "}<b>{notification.third_target.name}</b>
                    </>
                );
            case NotificationType["ChallengeFinished"]:
                return (
                    <ChallengeFinishedNotification notification={notification} onClick={props.onNotificationClick} />
                );
			default:
				return null;
		}
	};

    return (
        <li className={styles.notificationItem} tabIndex="0" data-tvalue={props.notification.notify_type} onClick={() => handleClick(props.linkType)} onKeyDown={(event) => handleKeyDown(event)}>
            <div data-tid={"action_view_notification"} className={cx(styles.notificationItemBody, { [styles.read]: props.notification.is_opened || props.isOpen })}>
                <div data-tid={"action_view_notification"} className={styles.notificationImageContainer}>
                    { getImage() }
                </div>
                <div data-tid={"action_view_notification"} className={styles.notificationItemContent}>
                    <div data-tid={"action_view_notification"}>
                        { getContent() }
                    </div>
                    <div data-tid={"action_view_notification"} className={styles.notificationItemDate}>
                        { getTime() }
                    </div>
                </div>
            </div>
        </li>
    );
}

export default withAlert(withRouter(withAuth(Notification)));