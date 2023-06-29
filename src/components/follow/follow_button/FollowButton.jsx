import React from 'react';
import { useIntl } from 'react-intl';
import { useFollow } from '@logora/debate.hooks.use_follow';
import { Tooltip } from '@logora/debate.tools.tooltip';
import { Button } from '@logora/debate.action.button';
import styles from './FollowButton.module.scss';
import PropTypes from "prop-types";

export const FollowButton = ({followableType, followableId, tooltipText, dataTid}) => {
    const intl = useIntl();
    const { followActive, handleFollow } = useFollow(followableType, followableId);

    return (
        <Tooltip text={tooltipText}>
            <Button data-tid={dataTid} className={styles.followUserButton} active={followActive} handleClick={handleFollow} data-testid={"button"}>
                { followActive ? 
                    <span data-testid={"followed"}>{(intl.formatMessage({ id: "follow.followed", defaultMessage: "Followed" }))}</span>
                :
                    <span data-testid={"follow"}>{(intl.formatMessage({ id: "follow.follow", defaultMessage: "Follow" }))}</span>
                }
                { !followActive && <span className={styles.followIcon}>+</span>}
            </Button>
        </Tooltip>
    )
};

FollowButton.propTypes = {
    /** Type of the followable content */
    followableType: PropTypes.string,
    /**  Id of the followable content */
    followableId: PropTypes.number,
    /**  Text of the tooltip */
    tooltipText: PropTypes.string,
    /**  Data-tid for tracking */
    dataTid: PropTypes.string
};
