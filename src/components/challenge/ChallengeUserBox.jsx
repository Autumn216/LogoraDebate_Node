import React from 'react';
import styles from './ChallengeUserBox.module.scss';
import { withConfig } from '@logora/debate.context.config_provider';
import { useIntl } from 'react-intl';
import { Link } from '@logora/debate.action.link'; 
import { PointIcon, CrownIcon } from '@logora/debate.icons';
import cx from 'classnames';

const ChallengeUserBox = (props) => {
    const user = props.user.user;
    const positionIndex = props.position;
    const intl = useIntl();

    return (
        <div className={cx(styles.userBoxContainer, styles[`position-${positionIndex + 1}`])}>
            {props.isFinished && props.isWinner &&
                <div className={styles.isFinished}>
                    <CrownIcon width={15} height={15} />
                </div>
            }
            <div className={styles.userImage}>
                <Link to={props.routes.userShowLocation.toUrl({userSlug: user.slug})} className={styles.participantLink}>
                    <img src={user.image_url} width={40} height={40} alt={intl.formatMessage({ id:"alt.profile_picture" }) + user.full_name } title={user.full_name} />
                </Link>
            </div>
            <div className={styles.userName}>
                <Link to={props.routes.userShowLocation.toUrl({userSlug: user.slug})} className={styles.participantLink}>
                    <div>{user.first_name}</div>
                    <div>{user.last_name}</div>
                </Link>
            </div>
            <div className={styles.userPoints}>
                <span>{ intl.formatNumber(user.points, { notation: 'compact', maximumFractionDigits: 1, roundingMode: "floor" }) }</span>
                <PointIcon width={15} height={15} />
            </div>
            <div className={cx(styles.userGroup, styles[`position-${positionIndex + 1}`])}>
                <span>{props.user.position.name}</span>
            </div>
        </div>
    )
}

export default withConfig(ChallengeUserBox);