import React, { useState } from 'react';
import { useAuth } from "@logora/debate.auth.use_auth";
import { useRoutes } from '@logora/debate.context.config_provider';
import { useDataProvider } from '@logora/debate.data.data_provider';
import { useHistory } from 'react-router';
import { useIntl } from 'react-intl';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import { PointIcon } from '@logora/debate.icons';
import cx from "classnames";
import styles from "./ChallengeInvitationBox.module.scss";

const ChallengeInvitationBox = (props) => {
    const history = useHistory();
    const intl = useIntl();
    const routes = useRoutes();
    const api = useDataProvider();
    const { currentUser } = useAuth();
    const [isAnswered, setIsAnswered] = useState(false);
    const [isAccepted, setIsAccepted] = useState(false);
    const [isDeleted, setIsDeleted] = useState(false);
    const isCurrentUser = props.challenge_invitation.sender.id === currentUser.id;
    const userPosition = isCurrentUser ? (props.challenge_invitation.group_context.positions[0].id === props.challenge_invitation.position.id ? 1 : 0) : (props.challenge_invitation.group_context.positions[0].id === props.challenge_invitation.position.id ? 0 : 1);

    const acceptChallenge = (uid) => {
        setIsAnswered(true);
        setIsAccepted(true);
        api.create("/debate_invitations/" + uid + "/accept", {}).then(response => {
            if(response.data.success && response.data.data.resource.debate) {
                const challengeSlug = response.data.data.resource.debate.slug;
                if (typeof window !== 'undefined') {
                    history.push({
                        pathname: routes.challengeShowLocation.toUrl({ challengeSlug: challengeSlug })
                    });
                    if (props.hideModal) {
                        props.hideModal();
                    }
                }
            }
        }).catch(error => {
            null;
        })
    }

    const rejectChallenge = (uid) => {
        setIsAnswered(true);
        api.create("/debate_invitations/" + uid + "/reject", {}).then(response => {
            // NOTHING TO DO
            if (props.hideModal) {
                props.hideModal();
            }
        }).catch(error => {
            null;
        })
    }

    const deleteInvitationChallenge = (uid) => {
        setIsDeleted(true);
        api.delete("/debate_invitations/", uid).then(response => {
            // NOTHING TO DO
        }).catch(error => {
            null;
        })
    }

    return (
        <>
            <div className={styles.container}>
                <div className={styles.title}>
                    <span>{props.challenge_invitation.group_context.name}</span>
                </div>
                <Link to={routes.userShowLocation.toUrl({userSlug: props.challenge_invitation.sender.slug})}>
                    <div className={cx(styles.user, styles[`position-${userPosition + 1}`])}>
                            <img src={isCurrentUser ? props.challenge_invitation.target.image_url : props.challenge_invitation.sender.image_url} alt={isCurrentUser ? props.challenge_invitation.target.full_name : props.challenge_invitation.sender.full_name} title={isCurrentUser ? props.challenge_invitation.target.full_name : props.challenge_invitation.sender.full_name} width={35} height={35} className={styles.userImage} />
                            <div className={styles.userInfo}>
                                <div className={styles.userName}>{isCurrentUser ? props.challenge_invitation.target.full_name : props.challenge_invitation.sender.full_name}</div>
                                <div className={styles.userPoint}><span>{ intl.formatNumber(isCurrentUser ? props.challenge_invitation.target.points : props.challenge_invitation.sender.points, { notation: 'compact', maximumFractionDigits: 1, roundingMode: "floor" }) }</span><PointIcon width={15} height={15}/></div>
                            </div>
                        <div className={cx(styles.positions, styles[`position-${userPosition + 1}`])}>
                            <span>{isCurrentUser ? props.challenge_invitation.group_context.positions.find(position => position.id !== props.challenge_invitation.position.id).name : props.challenge_invitation.position.name}</span>
                        </div>
                    </div>
                </Link>
                { props.challenge_invitation.sender.id === currentUser.id ?
                    <>
                        <div className={styles.footer}>
                            <span className={styles.text}>
                                <FormattedMessage id="group_invitation" />
                            </span>
                            <span className={styles.status}>
                                <FormattedMessage id="group_invitation.waiting" />
                            </span>
                        </div>
                        <div className={cx(styles.cancel, {[styles.isDeleted]: isDeleted})}>
                            {isDeleted ?
                                <div className={cx(styles.isAnswered, styles.isDeleted)}><span><FormattedMessage id="challenge.notification.is_deleted" /></span></div>
                            :
                                <span className={styles.cancelText} onClick={() => deleteInvitationChallenge(props.challenge_invitation.uid)}><FormattedMessage id="group_invitation.cancel.action" /></span>}
                        </div>
                    </>
                :   isAnswered ?
                        isAccepted ?
                            <div className={cx(styles.isAnswered, styles.isAccepted)}><span><FormattedMessage id="challenge.notification.is_accepted" /></span></div>
                        :
                            <div className={styles.isAnswered}><span><FormattedMessage id="challenge.notification.is_rejected" /></span></div>
                    :
                        <div className={styles.buttonBox}>
                            <span className={cx(styles.button, styles.accept)} onClick={() => acceptChallenge(props.challenge_invitation.uid)}><FormattedMessage id="action.accept" /></span>
                            <span className={cx(styles.button, styles.reject)} onClick={() => rejectChallenge(props.challenge_invitation.uid)}><FormattedMessage id="action.decline" /></span>
                        </div>
                }
            </div>
        </>
    )
}

export default ChallengeInvitationBox;