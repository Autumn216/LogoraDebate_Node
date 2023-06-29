import React, { useState, useEffect, lazy, Suspense } from "react";
import { Helmet } from "react-helmet";
import { LinkButton } from '@logora/debate.action.link_button';
import { Button } from '@logora/debate.action.button';
import { useAuth } from "@logora/debate.auth.use_auth";
import { useAuthToken } from "@logora/debate.auth.use_auth";
import { useConfig, useRoutes } from '@logora/debate.context.config_provider';
import { withLoading } from "@logora/debate.tools.with_loading";
import { withAlert } from "../../store/AlertProvider";
import { useDataProvider } from '@logora/debate.data.data_provider';
import { useResponsive } from "@logora/debate.hooks.use_responsive";
import { useRouteMatch, useLocation } from 'react-router';
import { useModal } from '@logora/debate.dialog.modal';
import { useAuthenticationRequired } from "@logora/debate.hooks.use_authentication_required";
import { PointIcon, QuestionIcon, VersusIcon } from '@logora/debate.icons';
import { Tooltip } from '@logora/debate.tools.tooltip';
import { UserBox } from "@logora/debate.user.user_box";
import { useIntl, FormattedMessage } from "react-intl";
import { Tabs, TabList, Tab, TabPanel } from 'react-tabs';
import { Link } from "react-router-dom";
import { PaginatedList } from "@logora/debate.list.paginated_list";
import { httpClient } from '@logora/debate.data.axios_client';
import { ExpandableText } from '@logora/debate.text.expandable_text';
import { FollowButton } from "@logora/debate.follow.follow_button";
import VotePaginatedList from "../VotePaginatedList";
import BadgeTab from "../BadgeTab";
import StandardErrorBoundary from "@logora/debate.error.standard_error_boundary";
import PointTab from "../PointTab";
import ArgumentUserBox from "../ArgumentUserBox";
import ChallengeInvitationBox from "../challenge/ChallengeInvitationBox";
import ChallengeBox from "../challenge/ChallengeBox";
import BoxSkeleton from '@logora/debate.skeleton.box_skeleton';
import UserContentSkeleton from '@logora/debate.skeleton.user_content_skeleton';
import SuggestionBox from "../SuggestionBox";
import ProposalUserBox from "../ProposalUserBox";
import CommentUserBox from "../CommentUserBox";
import cx from "classnames";
import styles from "./User.module.scss";
const ChallengeCreateModal = lazy(() => import('../challenge/ChallengeCreateModal'));

const User = (props) => {
	const match = useRouteMatch();
	const location = useLocation();
	const api = useDataProvider();
	const config = useConfig();
	const intl = useIntl();
	const auth = useAuth();
	const routes = useRoutes();
	const { removeToken } = useAuthToken(httpClient, process.env.API_AUTH_URL, 'logora_user_token');
	const { showModal } = useModal();
	const requireAuthentication = useAuthenticationRequired();
	const [isMobile, isTablet, isDesktop] = useResponsive();
	const [profileUser, setProfileUser] = useState(props.staticContext && props.staticContext.getUser);
	const [loadError, setLoadError] = useState(false);

	useEffect(() => {
		const { userSlug } = match.params;
		loadUser(userSlug);
	}, [])

	useEffect(() => { 
		props.setIsLoading(true);
		loadUser(match.params.userSlug);
	}, [match.params.userSlug])

	const disconnect = () => {
		auth.setIsLoggedIn(false);
        auth.setIsLoggingIn(false);
        auth.setCurrentUser({});
        removeToken();
		props.toastAlert("user.user.disconnect_success", "success");
	}

	const tabIndexInit = () => {
		const anchor = location.hash;
		let tabs = ["#arguments", "#activity", "#badges", "#disciples", "#mentors"];

		if(config.modules.suggestions && config.modules.suggestions.active === true) {
			tabs.splice(1, 0, "#suggestions");
		}

		if(config.modules.consultation) {
			config.modules.suggestions && config.modules.suggestions.active === true ? tabs.splice(2, 0, "#proposals") : tabs.splice(1, 0, "#proposals");
		}
		
		if(config.modules.challenges) {
			if(config.modules.suggestions && config.modules.suggestions.active === true || config.modules.consultation) {
				tabs.splice(2, 0, "#challenges");
			} else if ((config.modules.suggestions && config.modules.suggestions.active === false) && !config.modules.consultation) {
				tabs.splice(1, 0, "#challenges");
			} else {
				tabs.splice(3, 0, "#challenges");
			}
		}

		if(!anchor) {
			return 0
		} else {
			return tabs.indexOf(anchor);
		}
	}

	const loadUser = (userSlug) => {
		api.getOne("users", userSlug, {}).then((response) => {
			if (response.data.success) {
				const profileUser = response.data.data.resource;
				setProfileUser(profileUser);
				props.setIsLoading(false);
			} else {
				setLoadError(true);
			}
		})
		.catch((error) => {
			setLoadError(true);
		});
	}

	const isCurrentUser = () => {
		return auth.currentUser.slug === profileUser.slug;
	}

	const displayTag = (tag, index) => {
		return (
			<div className={styles.tagItem} key={index}>
				<Link to={routes.searchLocation.toUrl()} search={`?q=${tag.tag.display_name}`}>
					<div className={styles.tagItemBox}>
						<div className={styles.tagName}>{tag.tag.display_name}</div>
						<div className={styles.tagCount}>{tag.participation_count}</div>
					</div>
				</Link>
			</div>
		);
	};

	const openCreateModal = (name, positions, opponent, groupContext) => {
		if(auth.isLoggedIn) {
			showModal(
				<Suspense fallback={null}>
					<ChallengeCreateModal
						name={name}
						positions={positions}
						opponent={opponent}
						groupContext={groupContext}
					/>
				</Suspense>
			);
		} else {
			requireAuthentication({});
		}
	}


	if (loadError) {
		throw new Error(
			intl.formatMessage({ id: "user.user.error_user", defaultMessage: "Impossible to retrieve user." })
		);
	}

	return (
		<>
			{!props.isLoading ? (
				<div id='user' className={styles.fullWidth} data-pid='user'>
					{config.isDrawer !== true &&
						<Helmet>
							<title>{ profileUser.full_name + " - " + intl.formatMessage({ id: "user.user.metadata_title" }) + " - " + config.provider.name }</title>
							<meta name="description" content={intl.formatMessage({ id: "user.user.metadata_description" }, { user_full_name: profileUser.full_name }) } />
							<meta property="og:title" content={ profileUser.full_name + " - " + intl.formatMessage({ id: "user.user.metadata_title" }) + " - " + config.provider.name } />
							<meta property="og:description" content={intl.formatMessage({ id: "user.user.metadata_description" }, { user_full_name: profileUser.full_name })} />
							<meta property="og:type" content="website" />
							<meta property="og:site_name" content={config.provider.name} />
							{ (typeof window !== "undefined") &&
								<meta property="og:url" content={window.location.href.split(/[?#]/)[0]} />
							}
							{ (typeof window !== "undefined") &&
								<link rel='canonical' href={window.location.href.split(/[?#]/)[0]} />
							}
							<script type='application/ld+json'>
								{`{
									"@context": "https://schema.org",
									"@type": "Person",
									"name": "${profileUser.full_name}",
									"description": "${profileUser.description}",
									"image": "${profileUser.image_url}",
									"mainEntityOfPage": {
										"@type": "WebPage",
										"@id": "${
													typeof window !== "undefined" ? window.location.href.split(/[?#]/)[0] : ""
										}"
									}
								}`}
							</script>
						</Helmet>
					}
					<>
						<div className={styles.userBoxContainer}>
							<div className={styles.userDescriptionBox}>
								<div className={styles.userDescriptionImageBox}>
									<img
										className={styles.userDescriptionImage}
										src={profileUser.image_url}
										width={120}
										height={120}
										alt={isCurrentUser ? intl.formatMessage({ id: "user.user.profile_picture" }) : intl.formatMessage({ id: "user.user.user_profile_picture" }, { user_name: profileUser.full_name })}
									/>
								</div>
								{isMobile && (
									<div className={styles.userDescriptionContent}>
										<div className={styles.authorNameLine}>
											<h3 className={styles.userName}>{profileUser.full_name}</h3>
											{ profileUser.occupation && 
												<div className={styles.occupationBox}>
													<span className={styles.authorPoints}>
														{ profileUser.occupation }
													</span>
												</div>
											}
										</div>
										<div className={cx(styles.userPoints, {[styles.userPointsMobile]: isMobile})}>
											<span><FormattedMessage id="user.user.point_eloquence" values={{count: profileUser.points}} /></span>
											<PointIcon width={18} height={18} />
										</div>
										{profileUser.eloquence_title && 
											<div className={cx(styles.userPoints, {[styles.userPointsMobile]: isMobile})}>
												<span><FormattedMessage id={"badge." + profileUser.eloquence_title + ".reward"} /></span>
											</div>
										}
										{/* <DialogBox 
											isBottom
											titleKey={"info.eloquence.shortname"} 
											contentKey={"info.profil.first_time"}
											isHidden={this.props.currentUser.points < 50 ? false : true}
										> */}
											<Link to={routes.informationLocation.toUrl()}>
												<div className={styles.pointsInformations}>
													<QuestionIcon width={17} height={17} />
													<span><FormattedMessage id="user.user.points" /></span>
												</div>
											</Link>
										{/* </DialogBox> */}
										{!profileUser.description || profileUser.description === "null" ? null : (
											<ExpandableText 
												expandText={intl.formatMessage({ id: "action.read_more" })}
												collapseText={intl.formatMessage({ id: "action.read_less" })}
											>
												<div className={styles.userDescription}>
													<span>{profileUser.description}</span>
												</div>
											</ExpandableText>
										)}
									</div>
								)}
							</div>
							<div className={styles.userColumn}>
								{!isMobile && (
									
									<div className={styles.userDescriptionContent}>
										<div className={styles.authorNameLine}>
											<h3 className={styles.userName}>{profileUser.full_name}</h3>
											{ profileUser.occupation && 
												<div className={styles.occupationBox}>
													<span className={styles.authorPoints}>
														{ profileUser.occupation }
													</span>
												</div>
											}
										</div>
										<div className={styles.eloquenceLine}>
											<div className={styles.userPoints}>
												<span><FormattedMessage id="user.user.point_eloquence" values={{count: profileUser.points}} /></span>
												<PointIcon width={18} height={18} />
											</div>
											{profileUser.eloquence_title && 
												<div className={cx(styles.userPoints, {[styles.userPointsMobile]: isMobile})}>
													<span><FormattedMessage id={"badge." + profileUser.eloquence_title + ".reward"} /></span>
												</div>
											}
										</div>
										{/* <DialogBox 
											isBottom
											titleKey={"info.eloquence.shortname"} 
											contentKey={"info.profil.first_time"}
											isHidden={this.props.currentUser.points < 50 ? false : true}
										> */}
											<Link to={routes.informationLocation.toUrl()}>
												<div className={styles.pointsInformations}>
													<QuestionIcon width={17} height={17} />
													<span><FormattedMessage id="user.user.points" /></span>
												</div>
											</Link>
										{/* </DialogBox> */}
										{!profileUser.description || profileUser.description === "null" ? null : (
											<ExpandableText 
												expandText={intl.formatMessage({ id: "action.read_more" })}
												collapseText={intl.formatMessage({ id: "action.read_less" })}
											>
												<div className={styles.userDescription}>
													<span>{profileUser.description}</span>
												</div>
											</ExpandableText>
										)}
									</div>
								)}
								<div className={styles.userStatsLine}>
									<div className={styles.userStatsDebates}>
										<b>{profileUser.messages_count}</b>
										<FormattedMessage id='user.user.arguments' values={{ count: profileUser.messages_count }} />
									</div>
									<div className={styles.userStatsVotes}>
										<b>{profileUser.upvotes}</b>
										<FormattedMessage id='user.user.votes' values={{ count: profileUser.upvotes }} />
									</div>
									{ config.modules.suggestions && config.modules.suggestions.active === false ? 
										null 
									:
										<div className={styles.userStatsDebateSuggestions}>
											<b>{profileUser.debate_suggestions_count}</b>
											<FormattedMessage id='user.user.debate_suggestions' values={{ count: profileUser.debate_suggestions_count }} />
										</div>
									}
								</div>
								<div className={styles.userTagsLine}>
									<span className={styles.userTagListTitle}>
										<FormattedMessage id='user.user.tags_header' />
									</span>
									{profileUser.tags.length === 0 ? (
										<span className={styles.emptyTags}>
											<FormattedMessage id='user.user.empty_tags' />
										</span>
									) : (
										<div className={styles.userTagsList}>{profileUser.tags.map(displayTag)}</div>
									)}
								</div>
								<div className={isCurrentUser() ? styles.userFollowLine : cx(styles.userFollowLine, styles.userFollowLineUnsigned)}>
									{!isCurrentUser() ? (
										<>
											<div className={styles.userFollowButtonBox}>
												<FollowButton followableType={"user"} followableId={profileUser.id} tooltipText={intl.formatMessage({ id: "follow.follow_user", defaultMessage: "Follow this user to keep up with their activity" })} dataTid={"action_follow_user"}/>
											</div>
											{config.modules.challenges && 
												<Tooltip text={intl.formatMessage({ id:"user.user.challenge_invite" })}>
													<div data-tid={"action_create_challenge_profile"} className={styles.userChallenge} onClick={() => openCreateModal(null, null, profileUser, false)}>
														<VersusIcon width={18} height={18} />
														<FormattedMessage id="user.user.challenge_user_debate" />
													</div>
												</Tooltip>
											}
										</>
									) : (
										<>
											<div className={styles.userEditButtonBox}>
												<LinkButton to={routes.userEditLocation.toUrl()} data-tid={"action_edit_profile"} className={styles.userEditButton}>
													{ intl.formatMessage({ id:"user.user.update_profile" }) }
												</LinkButton>
											</div>
											{ config.auth?.hideLogoutButton !== true &&
												<div className={styles.userEditButtonBox}>
													<Button active handleClick={disconnect} className={styles.userEditButton}>
														{ intl.formatMessage({ id:"user.user.disconnect" }) }
													</Button>
												</div>
											}
										</>
									)}
								</div>
							</div>
						</div>
						<div className={styles.userTabs}>
							<Tabs defaultIndex={tabIndexInit()} className={styles.fullWidth}>
								<TabList className={styles.navTabs}>
									<Tab className={cx(styles.navItem, styles.navLink)} selectedClassName={styles.active}>
										<FormattedMessage id='user.user.arguments' values={{ count: 2 }} />
									</Tab>
									{ config.modules.suggestions && config.modules.suggestions.active === false ? 
										null 
									:
										<Tab className={cx(styles.navItem, styles.navLink)} selectedClassName={styles.active}>
											<FormattedMessage id='user.user.debate_suggestions' values={{ count: 2 }} />
										</Tab>
									}
									{ config.modules.comments &&
										<Tab className={cx(styles.navItem, styles.navLink)} selectedClassName={styles.active}>
											<FormattedMessage id='user.user.comments' values={{ count: 2 }} />
										</Tab>
									}
									{ config.modules.consultation &&
										<Tab className={cx(styles.navItem, styles.navLink)} selectedClassName={styles.active}>
											<FormattedMessage id='user.user.proposals' values={{ count: 2 }} />
										</Tab>
									}
									{ config.modules.challenges &&
										<Tab className={cx(styles.navItem, styles.navLink)} selectedClassName={styles.active}>
											<FormattedMessage id='user.user.challenges' values={{ count: 2 }} />
										</Tab>
									}
									<Tab className={cx(styles.navItem, styles.navLink)} selectedClassName={styles.active}>
										<FormattedMessage id='user.user.eloquence' values={{ count: 2 }} />
									</Tab>
									<Tab className={cx(styles.navItem, styles.navLink)} selectedClassName={styles.active}>
										<FormattedMessage id='user.user.badges' values={{ count: 2 }} />
									</Tab>
									<Tab className={cx(styles.navItem, styles.navLink)} selectedClassName={styles.active}>
										<FormattedMessage id='user.user.disciples' values={{ count: 2 }} />
									</Tab>
									<Tab className={cx(styles.navItem, styles.navLink)} selectedClassName={styles.active}>
										<FormattedMessage id='user.user.mentors' values={{ count: 2 }} />
									</Tab>
								</TabList>
								<TabPanel selectedClassName={styles.tabPane}>
										<div className={styles.tabPaneTitle}>
											<FormattedMessage id='user.user.user_arguments' />
										</div>
										<StandardErrorBoundary>
											<VotePaginatedList
												voteableType={"Message"}
												currentListId={"userArgumentsList"}
												resource={"users/" + match.params.userSlug + "/messages"}
												resourcePropName="argument"
												loadingComponent={<UserContentSkeleton />}
												filters={isCurrentUser() ? {} : { "status": "accepted" }}
												perPage={6}
												display='column'
												staticContext={props.staticContext}
												staticResourceName={"getUserMessages"}
												sortOptions={[
													{
														name: "recent",
														value: "-created_at",
														type: "sort",
														dataTid: "action_sort_user_arguments_recent",
														text: intl.formatMessage({id: "info.sort_by_newest" }),
													},
													{
														name: "old",
														value: "+created_at",
														type: "sort",
														dataTid: "action_sort_user_arguments_old",
														text: intl.formatMessage({id: "info.sort_by_oldest" }),
													},
													{
														name: "relevance",
														value: "-score",
														type: "sort",
														dataTid: "action_sort_user_arguments_relevant",
														text: intl.formatMessage({id: "info.sort_by_relevance" }),
													},
													{
														name: "most_supported",
														value: "-upvotes",
														type: "sort",
														dataTid: "action_sort_user_most_supported",
														text: intl.formatMessage({id: "info.sort_by_most_supported" }),
													},
													{
														name: "is_reply",
														value: "true",
														type: "filter",
														dataTid: "action_sort_user_arguments_is_reply",
														text: intl.formatMessage({id: "info.sort_by_replies" }),
													},
												]}
											>
												<ArgumentUserBox />
											</VotePaginatedList>
										</StandardErrorBoundary>
									</TabPanel>
									{ config.modules.suggestions && config.modules.suggestions.active === false ? 
										null 
									:
										<TabPanel selectedClassName={styles.tabPane}>
											<div className={styles.tabPaneTitle}>
												<FormattedMessage id='user.user.user_suggestions' />
											</div>
											<StandardErrorBoundary>
												<VotePaginatedList
													voteableType={"Suggestion"}
													currentListId={"suggetionList"}
													filters={{ "user_id": profileUser.id, "is_answered": false, ...(isCurrentUser() && { "status": "accepted" }) }}
													loadingComponent={<UserContentSkeleton />}
													resource={"debate_suggestions"} 
													resourcePropName="suggestion"
													sort={"-created_at"}
													perPage={6}
													searchBar={false}
												>
													<SuggestionBox />
												</VotePaginatedList>
											</StandardErrorBoundary>
										</TabPanel>
									}
									{ config.modules.comments &&
										<TabPanel selectedClassName={styles.tabPane}>
											<div className={styles.tabPaneTitle}>
												<FormattedMessage id='user.user.user_comments' />
											</div>
											<StandardErrorBoundary>
												<VotePaginatedList
													voteableType={"Message"}
													currentListId={"commentsList"}
													filters={{ "user_id": profileUser.id, "group_type": "Source", ...(isCurrentUser() && { "status": "accepted" }) }}
													loadingComponent={<UserContentSkeleton />}
													resource={"/messages"} 
													resourcePropName="comment"
													perPage={6}
													display='column'
													searchBar={false}
												>
													<CommentUserBox />
												</VotePaginatedList>
											</StandardErrorBoundary>
										</TabPanel>
									}
									{ config.modules.consultation &&
										<TabPanel selectedClassName={styles.tabPane}>
											<div className={styles.tabPaneTitle}>
												<FormattedMessage id='user.user.user_proposals' />
											</div>
											<StandardErrorBoundary>
												<VotePaginatedList
													voteableType={"Proposal"}
													currentListId={"proposalsList"}
													filters={{ "user_id": profileUser.id }}
													loadingComponent={<UserContentSkeleton />}
													resource={"users/" + match.params.userSlug + "/proposals"} 
													resourcePropName="proposal"
													perPage={6}
													searchBar={false}
												>
													<ProposalUserBox userProfileProposal={true} />
												</VotePaginatedList>
											</StandardErrorBoundary>
										</TabPanel>
									}
									{config.modules.challenges &&
										<TabPanel selectedClassName={styles.tabPane}>
											<div className={styles.tabPaneTitle}>
												<FormattedMessage id='user.user.user_challenges' />
											</div>
											{ isCurrentUser() && config.modules.challenges && 
												<>
													<div className={styles.tabTitle}>
														<FormattedMessage id="group_invitation.sended.action_plural" />
													</div>
													<PaginatedList 
														currentListId={"debateInvitationList"}
														loadingComponent={<BoxSkeleton />}
														resourcePropName="challenge_invitation"
														resource={'debate_invitations'} 
														sort={"-created_at"}
														filters={{ "with_user": profileUser.id, "is_answered": false }}
														perPage={6}
													>
														<ChallengeInvitationBox />
													</PaginatedList>
												</>
											}
											<div className={styles.tabTitle}><FormattedMessage id="tabs.private_debates" /></div>
											<StandardErrorBoundary>
												<PaginatedList
													currentListId={"userPrivateDebatesList"}
													resource={"debates"}
													filters={{ "with_user": profileUser.id }}
													loadingComponent={<BoxSkeleton />}
													resourcePropName="debate"
													elementsPerLine={2}
													perPage={10}
													sortOptions={[
														{
															name: "recent",
															value: "-created_at",
															type: "sort",
															dataTid: "action_sort_user_challenges_recent",
															text: intl.formatMessage({id: "info.sort_by_newest" }),
														},
														{
															name: "old",
															type: "sort",
															value: "+created_at",
															dataTid: "action_sort_user_challenges_old",
															text: intl.formatMessage({id: "info.sort_by_oldest" }),
														},
													]}
												>
													<ChallengeBox />
												</PaginatedList>
											</StandardErrorBoundary>
										</TabPanel>
									}
									<TabPanel selectedClassName={styles.tabPane}>
										<div className={styles.tabPaneTitle}>
											<FormattedMessage id='user.user.user_points' />
										</div>
										<StandardErrorBoundary>
											<PointTab userSlug={match.params.userSlug} />
										</StandardErrorBoundary>
									</TabPanel>
									<TabPanel selectedClassName={styles.tabPane}>
										<div className={styles.tabPaneTitle}>
											<FormattedMessage id='user.user.user_badges' />
										</div>
										<StandardErrorBoundary>
											<BadgeTab userSlug={match.params.userSlug} user={profileUser}/>
										</StandardErrorBoundary>
									</TabPanel>
									<TabPanel selectedClassName={styles.tabPane}>
										<div className={styles.tabPaneTitle}>
											<FormattedMessage id='user.user.user_disciples' />
										</div>
										<StandardErrorBoundary>
											<PaginatedList
												currentListId={"userDisciplesList"}
												resource={"users/" + match.params.userSlug + "/disciples"}
												loadingComponent={<UserContentSkeleton hideBody />}
												resourcePropName="user"
												perPage={6}
											>
												<UserBox />
											</PaginatedList>
										</StandardErrorBoundary>
									</TabPanel>
									<TabPanel selectedClassName={styles.tabPane}>
										<div className={styles.tabPaneTitle}>
											<FormattedMessage id='user.user.user_mentors' />
										</div>
										<StandardErrorBoundary>
											<PaginatedList
												currentListId={"userMentorsList"}
												resource={"users/" + match.params.userSlug + "/mentors"}
												loadingComponent={<UserContentSkeleton hideBody />}
												resourcePropName="user"
												perPage={6}
											>
												<UserBox />
											</PaginatedList>
										</StandardErrorBoundary>
									</TabPanel>
							</Tabs>
						</div>
					</>
				</div>
			) : null}
		</>
	);
}

export default withAlert(withLoading(User));
