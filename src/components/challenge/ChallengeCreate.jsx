import React from 'react';
import { PaginatedList } from "@logora/debate.list.paginated_list";
import { VersusIcon, UserIcon, PointIcon, QuestionIcon } from '@logora/debate.icons';
import TextFormatter from '../../utils/TextFormatter';
import { withResponsive } from "@logora/debate.hooks.use_responsive";
import { withAuth } from "@logora/debate.auth.use_auth";
import { withConfig } from '@logora/debate.context.config_provider';
import AnnouncementDialog from '@logora/debate.dialog.announcement_dialog';
import ChallengeCreateBox from './ChallengeCreateBox';
import BoxSkeleton from '@logora/debate.skeleton.box_skeleton';
import { Link } from '@logora/debate.action.link';
import cx from "classnames";
import styles from './ChallengeCreate.module.scss';

const ChallengeCreate = props => {
	return (
		<>
			<div className={styles.challengeCreateContainer}>
				<div className={cx(styles.contextHintHeader, {[styles.contextHintDisabled]: props.isLoggedIn})}>
					<div className={styles.title}><TextFormatter id="challenge.create" /></div>		
					<div className={styles.contextHeaderLine}>
						<VersusIcon className={styles.versusIcon} height={35} width={props.isMobile ? 100 : 30} />
						<TextFormatter id="challenge.create_welcome" />
					</div>
					<div className={styles.contextHeaderLine}>
						<UserIcon className={styles.headerIcon} height={20} width={props.isMobile ? 120 : 37} />
						<TextFormatter id="challenge.create_invitation" />
					</div>
				</div>
				{props.isLoggedIn && props.currentUser.points < 2000 && 
					<AnnouncementDialog fullWidth className={styles.annoucementChallenge}>
						<div className={styles.pointsRestriction}>
							<span className={styles.pointsText}><TextFormatter id="info.challenge.points" /></span>
							<span className={styles.userPoints}><TextFormatter id="info.point_eloquence" count={800} variables={{variable: 800}} /></span>
							<PointIcon width={18} height={18} />
						</div>
						<div className={styles.pointsRestriction}>
							<span className={styles.userPoints}><TextFormatter id="info.user_points" />{props.currentUser.points}</span>
							<PointIcon width={18} height={18} />
						</div>
						<Link to={props.routes.informationLocation.toUrl()}>
							<div className={styles.pointsInformations}>
								<QuestionIcon width={17} height={17} />
								<span><TextFormatter id="info.points" /></span>
							</div>
						</Link>
					</AnnouncementDialog>
				}
				<div className={cx({[styles.listDisabled]: props.isLoggedIn && props.currentUser.points < 800})}>
					<PaginatedList 
						currentListId={"challengeList"}
						loadingComponent={<BoxSkeleton />}
						filters={ {"is_admin": true} }
						resource={'group_contexts'} 
						resourcePropName={'challenge'}
						perPage={6}
						searchBar={true}
						sortOptions={
							[
								{
									name: "popular",
									value: "true",
									type: "filter",
									textKey: "challenge.sort_by_popular",
								},
								{
									name: "recent",
									value: "-created_at",
									textKey: "challenge.sort_by_newest",
								},
								{
									name: "old",
									value: "+created_at",
									textKey: "challenge.sort_by_oldest",
								}
							]
						}
					>
						<ChallengeCreateBox />
					</PaginatedList>
				</div>
			</div>
		</>
	)
}

export default withConfig(withAuth(withResponsive(ChallengeCreate)));