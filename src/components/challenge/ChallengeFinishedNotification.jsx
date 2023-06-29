import React from 'react';
import { FormattedMessage } from 'react-intl';
import { withAuth } from "@logora/debate.auth.use_auth";
import { getWinningVote } from "@logora/debate.util.get_winning_vote";

const ChallengeInvitationNotification = props => {
    const isCurrentUserWinner = () => {
        const winningPositionId = getWinningVote(props.notification.target.votes_count, props.notification.target.group_context.positions).winningPositionObj.id;
        const userDebateMember = props.notification.target.debate_members.find(db => db.user.id === props.currentUser.id);
        return userDebateMember.position.id.toString() == winningPositionId;
    }    

    return(
        <>
            <FormattedMessage id="challenge.your_challenge" /><b>{" "}{props.notification.target.name}</b>{" "}
            <FormattedMessage id="challenge.with" />{" "}<b>{props.notification.target.debate_members.filter(db => db.user.id !== props.currentUser.id)[0].user.full_name}</b>{" "}
            <FormattedMessage id="challenge.finished" />{" "} { isCurrentUserWinner() ? <FormattedMessage id="challenge.you_won" /> : <FormattedMessage id="challenge.you_lost" /> }
        </>
    );
}

export default withAuth(ChallengeInvitationNotification);