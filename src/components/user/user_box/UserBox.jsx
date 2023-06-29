import React from 'react';
import { useIntl } from 'react-intl';
import { useRoutes } from '@logora/debate.context.config_provider';
import { FormattedMessage } from 'react-intl';
import { Avatar } from '@logora/debate.user.avatar';
import { PointIcon } from '@logora/debate.icons';
import { Link } from 'react-router-dom';
import styles from './UserBox.module.scss';

export const UserBox = (props) => {
  const intl = useIntl();
  const routes = useRoutes();

  return (
		<div className={styles.userBox}>
			<div className={styles.userBoxHeader}>
				<Link to={routes.userShowLocation.toUrl({userSlug: props.user.slug})}>
					<Avatar data-tid={"action_view_user_image"} userName={props.user.full_name} avatarUrl={props.user.image_url} isOnline={(new Date(props.user.last_activity) > Date.now() )} size={60} />
				</Link>
			</div>
			<div className={styles.userBoxDescription}>
				<Link to={routes.userShowLocation.toUrl({userSlug: props.user.slug})}>
					<div data-tid={"action_view_user_name"} className={styles.userBoxName} title={props.user.full_name}>
						{props.user.full_name}
					</div>
				</Link>
				<Link to={routes.userShowLocation.toUrl({userSlug: props.user.slug})} hash={"activity"}>
					<div className={styles.userBoxPoints}>
						<span className={styles.pointsCount}>{ intl.formatNumber(props.user.points, { notation: 'compact', maximumFractionDigits: 1, roundingMode: "floor" }) }</span>
						<span>
							<FormattedMessage id="user.user_box.info_point_eloquence" values={{ count: props.user.points, variable: null }} defaultMessage="Eloquence point" />
						</span>
						<PointIcon width={16} height={16} />
					</div>
				</Link>
				<Link to={routes.userShowLocation.toUrl({userSlug: props.user.slug})}>
					<div className={styles.userBoxStats}>
						<div className={styles.userDebates}>
							<span className={styles.userCount}>{props.user.messages_count}</span>
							<FormattedMessage id="user.user_box.user_arguments" values={{ count: props.user.messages_count }} defaultMessage="Arguments" />
						</div>
						<div className={styles.userVotes}>
							<span className={styles.userCount}>{props.user.upvotes}</span>
							<FormattedMessage id="user.user_box.user_votes" values={{ count: props.user.upvotes }} defaultMessage="Votes" />
						</div>
					</div>
				</Link>
			</div>
		</div>
	);
}