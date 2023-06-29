import React, { useState } from 'react';
import { useDataProvider } from '@logora/debate.data.data_provider';
import { useHistory } from 'react-router';
import { useRoutes, useConfig } from '@logora/debate.context.config_provider';
import { useRelativeTime } from '@logora/debate.hooks.use_relative_time';
import { FormattedMessage } from 'react-intl';
import { ChatIcon } from '@logora/debate.icons';
import cx from 'classnames';
import styles from './ChallengeInvitationNotification.module.scss';

const ChallengeInvitationNotification = props => {
    const routes = useRoutes();
    const history = useHistory();
    const api = useDataProvider();
    const [isAnswered, setIsAnswered] = useState(false);
    const [isAccepted, setIsAccepted] = useState(false);
    const relativeTime = useRelativeTime(new Date(props.notification.created_at).getTime());
    const config = useConfig();

    const acceptChallenge = (e) => {
        setIsAnswered(true);
        setIsAccepted(true);
        const notification = props.notification;
        const uid = notification.second_target.uid;
        if (!props.onClick) {
            e.stopPropagation();
        }
        api.create("/debate_invitations/" + uid + "/accept", {}).then(response => {
            if(response.data.success && response.data.data.resource.debate) {
                const challengeSlug = response.data.data.resource.debate.slug;
                if(typeof window !== 'undefined') {
                    history.push({
                        pathname: routes.challengeShowLocation.toUrl({ challengeSlug: challengeSlug })
                    });
                    if (props.onNotificationClick) {
                        props.onNotificationClick();
                    }
                }
            }
        }).catch(error => {
            null;
        })
    }

    const rejectChallenge = (e) => {
        setIsAnswered(true);
        const notification = props.notification;
        const uid = notification.second_target.uid;
        if (!props.onClick) {
            e.stopPropagation();
        }
        api.create("/debate_invitations/" + uid + "/reject", {}).then(response => {
            // NOTHING TO DO
            if (props.onNotificationClick) {
                props.onNotificationClick();
            }
        }).catch(error => {
            null;
        })
    }

    return (
        <>
            <b>{props.notification.actor.full_name}</b> <FormattedMessage id='challenge.notification.invitation' />{" "}
            <span className={styles.notificationItemDate}>{ relativeTime }</span>
            <div className={styles.notificationBorder}>
                <ChatIcon width={15} height={15} {...(config.theme.iconTheme === "edge" && {variant: "edge"})} /><b>{props.notification.third_target.name}</b>
            </div>
            <span><FormattedMessage id='challenge.notification.position' />{" "}<b>{props.notification.second_target && props.notification.second_target.group_context.positions.find(position => position.id !== props.notification.second_target.position.id).name}</b></span>
            {(props.notification.second_target && props.notification.second_target.is_answered && props.notification.second_target.is_accepted) &&
                <div className={cx(styles.challengeIsAnswered, styles.challengeIsAccepted)} onClick={props.onClick}><FormattedMessage id="challenge.notification.is_accepted" /></div>
            }
            {isAnswered && isAccepted &&
                <div className={cx(styles.challengeIsAnswered, styles.challengeIsAccepted)} onClick={props.onClick}><FormattedMessage id="challenge.notification.is_accepted" /></div>
            }
            {(props.notification.second_target && props.notification.second_target.is_answered && !props.notification.second_target.is_accepted) &&
                <div className={cx(styles.challengeIsAnswered, styles.challengeIsRejected)}><FormattedMessage id="challenge.notification.is_rejected" /></div>
            }
            {isAnswered && !isAccepted &&
                <div className={cx(styles.challengeIsAnswered, styles.challengeIsRejected)}><FormattedMessage id="challenge.notification.is_rejected" /></div>
            }
            {props.notification.second_target && props.notification.second_target && props.notification.second_target.is_answered === false && isAnswered === false &&
                <div className={styles.notificationButtonBox}>
                    <span className={cx(styles.notificationButton, styles.accept)} onClick={(e) => acceptChallenge(e)}><FormattedMessage id="action.accept" /></span>
                    <span className={cx(styles.notificationButton, styles.reject)} onClick={(e) => rejectChallenge(e)}><FormattedMessage id="action.decline" /></span>
                </div>
            }
        </>
    );
}

export default ChallengeInvitationNotification;