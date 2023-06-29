import React, { Suspense, lazy, useState, useEffect } from "react";
import { useAuth } from "@logora/debate.auth.use_auth";
import { withConfig } from '@logora/debate.context.config_provider';
import { withResponsive } from "@logora/debate.hooks.use_responsive";
import { useIntl } from "react-intl";
import { useAuthenticationRequired } from "@logora/debate.hooks.use_authentication_required";
import { withRouter, matchPath } from "react-router";
import { AlarmIcon, ChatIcon, LoginIcon, SuggestionIcon, CommunityIcon } from '@logora/debate.icons';
import { Dropdown } from '@logora/debate.tools.dropdown';
import { IconTextLink } from '@logora/debate.action.icon_text_link';
import { Avatar } from '@logora/debate.user.avatar';
const NotificationMenu = lazy(() => import('./NotificationMenu'));
const AnnouncementDialog = lazy(() => import('@logora/debate.dialog.announcement_dialog'));
import { VersusIcon } from '@logora/debate.icons';
import cx from "classnames";
import styles from "./Navbar.module.scss";

const Navbar = (props) => {
	const intl = useIntl();
	const { isLoggedIn, currentUser } = useAuth();
	const [newNotificationsCount, setNewNotificationsCount] = useState(0);
	const requireAuthentication = useAuthenticationRequired();

	useEffect(() => {
		if (isLoggedIn) {
			const unreadNotificationsCount = currentUser.notifications_count;
			setNewNotificationsCount(unreadNotificationsCount);
		}
	}, [isLoggedIn])


	const toggleNotificationDropdown = () => {
		setNewNotificationsCount(0);
	};

	const isActive = (path, activePath) => {
		return Boolean(matchPath(path, {
			path: activePath,
			exact: true,
			strict: false
		}));
	}

	const showLoginModal = () => {
		requireAuthentication({});
	}

	return (
		<>
			<div className={styles.navbar} id="logora_navbar">
				<div className={""}>
					{props.config.layout?.hideProviderNavbar === false ? 
						(
							<div className={cx(styles.providerNavbar)}>
								<div className={styles.providerLogo}>
									<a href={props.config.provider.url}>
										{props.isMobile ? (
											<img className={styles.navbarLogoMobile} src={props.config.logo.desktop} width={40} height={40} alt={"Logo " + props.config.provider.name} />
										) :
										(
											<img className={styles.navbarLogoDesktop} src={props.config.logo.desktop} width={200} height={50} alt={"Logo " + props.config.provider.name} />
										)
										}
									</a>
								</div>
							</div>
						) 
					: null}
					<div className={cx(styles.appNavbar, {[styles.navbarContainer]: !props.hideMargins, [styles.navbarContainerFullWidth]: props.hideMargins })} >
						<IconTextLink
							className={!isLoggedIn ? cx(styles.navbarHomeContainer, styles.loggedSpacing) : styles.navbarHomeContainer}
							data-tid={"view_index"}
							text={intl.formatMessage({ id: "info.all_debates_short" })}
							to={props.routes.indexLocation.toUrl()}
							active={isActive(props.location.pathname, props.routes.indexLocation.path) || isActive(props.location.pathname, props.routes.rootLocation.path || "/")}
						>
							<ChatIcon height={24} width={24} {...(props.config.theme.iconTheme === "edge" && {variant: "edge"})} />
						</IconTextLink>

						{ props.config.modules.consultation &&
							<IconTextLink
								className={!isLoggedIn ? cx(styles.consultationButton, styles.loggedSpacing) : styles.consultationButton}
								data-tid={"view_consultation"}
								icon={CommunityIcon}
								text={intl.formatMessage({ id: "info.consultations" })}
								to={props.routes.consultationIndexLocation.toUrl()}
								active={isActive(props.location.pathname, props.routes.consultationIndexLocation.path)}
							/>
						}
						{ props.config.modules?.suggestions?.active === false ?
								null
							:
								!props.isMobile &&
								<IconTextLink
									className={!isLoggedIn ? cx(styles.suggestionButton, styles.loggedSpacing) : styles.suggestionButton}
									data-tid={"view_suggestions"}
									icon={SuggestionIcon}
									text={intl.formatMessage({ id: "info.suggestion" })}
									to={props.routes.suggestionLocation.toUrl()}
									active={isActive(props.location.pathname, props.routes.suggestionLocation.path)}
								/>
						}
						{ props.config.modules?.challenges &&
							!props.isMobile &&
								<IconTextLink
									className={!isLoggedIn ? cx(styles.challengeButton, styles.loggedSpacing) : cx(styles.challengeButton)}
									data-tid={"view_challenges"}
									icon={VersusIcon}
									text={intl.formatMessage({ id: "tabs.private_debates" })}
									to={props.routes.challengeIndexLocation.toUrl()}
									active={isActive(props.location.pathname, props.routes.challengeIndexLocation.path)}
									pin={true}
								/>
						}
						{ isLoggedIn ? 
							(
								<>
									<Suspense fallback={null}>
										<Dropdown 
											dropdownClassName={styles.notificationDropdown} 
											className={!isLoggedIn ? cx(styles.notificationsContainer, styles.loggedSpacing) : styles.notificationsContainer} 
											dropdownListRight={true} 
											dropdownListMobile={true} 
											scrollable={true} 
											backgroundFixed={true} 
											handleClick={toggleNotificationDropdown}
										>
											<div data-tid={"action_view_notifications"} className={styles.notificationIcon}>
												<IconTextLink
													data-tid={"action_view_notifications"}
													icon={AlarmIcon}
													text={intl.formatMessage({ id: "info.alarm" })}
													pin={newNotificationsCount > 0 && true}
													pinText={newNotificationsCount > 0 && newNotificationsCount}
												/>
											</div>
											<NotificationMenu />
										</Dropdown>
									</Suspense>
									<IconTextLink
										className={!isLoggedIn ? cx(styles.navbarProfile, styles.loggedSpacing) : styles.navbarProfile}
										data-tid={"view_user_profile"}
										text={intl.formatMessage({ id: "info.profile" })}
										to={props.routes.userShowLocation.toUrl({ userSlug: currentUser.slug })}
										active={isActive(props.location.pathname, props.routes.userShowLocation.path)}
									>
										<div data-tid={"view_user_profile"}>
											<Avatar
												avatarUrl={currentUser.image_url}
												userName={currentUser.full_name}
												size={24}
												data-tid={"view_user_profile"}
											/>
										</div>
									</IconTextLink>
								</>
							) 
						: 
							(
								<div className={!isLoggedIn ? cx(styles.navbarLoginAction, styles.loggedSpacing) : styles.navbarLoginAction}>
									<div className={styles.navbarLoginButton} data-tid={"action_login_link"} onClick={() => showLoginModal()}>
										<IconTextLink 
											icon={LoginIcon} 
											text={intl.formatMessage({ id: "action.sign_in" })}
											data-tid={"action_login_link"} 
										/>
									</div>
								</div>
							)
						}
					</div>
				</div>
			</div>
			{props.config.modules?.announcementDialog && (
				<div className={styles.navbarAnnouncementContainer}>
					<Suspense fallback={null}>
						<AnnouncementDialog message={props.config.modules.announcementMessage} fullWidth />
					</Suspense>
				</div>
			)}
		</>
	);
}
export default withResponsive(withConfig(withRouter(Navbar)));