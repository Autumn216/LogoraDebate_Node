import React from "react";
import { useIntl } from 'react-intl';
import styles from "./ChallengeVoteButton.module.scss";
import cx from 'classnames';
import { UpvoteIcon, CheckboxIcon } from '@logora/debate.icons';

const ChallengeVoteButton = props => {
    const intl = useIntl();

    return (
        <div className={cx(styles.userVote, styles[`position-${props.position + 1}`], {[styles.active]: props.isVoteActive})}>
            {props.isVoteActive ? 
                <>
                    <CheckboxIcon width={20} height={20} />
                    { intl.formatMessage({ id: "action.is_voted" })}
                </>
            :
                <>
                    <UpvoteIcon width={20} height={20} />
                    { intl.formatMessage({ id: "action.not_voted" })}
                </>
            }
            
        </div>
    )
}

export default ChallengeVoteButton;