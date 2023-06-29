import React from "react";
import { Modal } from '@logora/debate.dialog.modal';
import { useModal } from '@logora/debate.dialog.modal';
import { useAuth } from "@logora/debate.auth.use_auth";
import { useIntl, FormattedMessage } from "react-intl";
import { withConfig } from '@logora/debate.context.config_provider';
import { withRouter, matchPath } from "react-router";
import { useAuthenticationRequired } from "@logora/debate.hooks.use_authentication_required";
import { ChatIcon, CommunityIcon, SuggestionIcon, MobileCloseIcon, VersusIcon, LoginIcon } from '@logora/debate.icons';
import { Link } from '@logora/debate.action.link';
import { Avatar } from '@logora/debate.user.avatar';
import cx from "classnames";
import styles from "./NavbarModal.module.scss";

const NavbarModal = (props) => {
    const { hideModal } = useModal();
    const { isLoggedIn, currentUser } = useAuth();
    const intl = useIntl();
	const requireAuthentication = useAuthenticationRequired();

    const isActive = (path, activePath) => {
		const match = matchPath(path, {
			path: activePath,
			exact: true,
			strict: false
		});
		if (match) {
			return true
		}
	}

    const showLoginModal = () => {
		requireAuthentication({});
	}

    return (
        <Modal fullScreen showCloseButton>
            <div className={styles.modalContainer}>
                <div className={styles.modalTitle}>
                    <FormattedMessage id="info.menu" />
                </div>
                <div className={styles.navigationContainer}>
                    <div className={cx(styles.modalItem, {[styles.active]: isActive(props.location.pathname, props.routes.indexLocation.path) || isActive(props.location.pathname, props.routes.rootLocation.path)})} onClick={hideModal}>
                        <Link className={cx(styles.itemContainer, {[styles.activeItem]: isActive(props.location.pathname, props.routes.indexLocation.path ) || isActive(props.location.pathname, props.routes.rootLocation.path)})} to={props.routes.indexLocation.toUrl()} data-tid={"view_index"}>
                            <ChatIcon {...(props.config.theme.iconTheme === "edge" && {variant: "edge"})} />
                            <span className={styles.text}><FormattedMessage id="info.all_debates_short" /></span>
                        </Link>
                    </div>
                    {props.config.modules.consultation &&
                        <div className={cx(styles.modalItem, {[styles.active]: isActive(props.location.pathname, props.routes.consultationIndexLocation.path)})} onClick={hideModal}>
                            <Link className={cx(styles.itemContainer, {[styles.activeItem]: isActive(props.location.pathname, props.routes.consultationIndexLocation.path)})} to={props.routes.consultationIndexLocation.toUrl()} data-tid={"view_consultation"}>
                                <CommunityIcon />
                                <span className={cx(styles.text, styles.consultationText)}><FormattedMessage id="info.consultations" /></span>
                            </Link>
                        </div>
                    }
                    { props.config.modules.suggestions && props.config.modules.suggestions.active === false ?
                            null
                        :
                            <div className={cx(styles.modalItem, {[styles.active]: isActive(props.location.pathname, props.routes.suggestionLocation.path)})} onClick={hideModal}>
                                <Link className={cx(styles.itemContainer, styles.suggestionItem, {[styles.activeItem]: isActive(props.location.pathname, props.routes.suggestionLocation.path)})} to={props.routes.suggestionLocation.toUrl()} data-tid={"view_suggestions"}>
                                    <SuggestionIcon />
                                    <span className={styles.text}><FormattedMessage id="info.suggestion" /></span>
                                </Link>
                            </div>
                    }
                    { props.config.modules.challenges &&
                        <div data-tid={"view_challenge_mobile"} className={cx(styles.modalItem, {[styles.active]: isActive(props.location.pathname, props.routes.challengeIndexLocation.path)})} onClick={hideModal}>
                            <Link className={cx(styles.itemContainer, styles.challengeItem, {[styles.activeItem]: isActive(props.location.pathname, props.routes.challengeIndexLocation.path)})} to={props.routes.challengeIndexLocation.toUrl()} data-tid={"view_challenges"}>
                                <div className={cx(styles.newFeatureBadge, styles.challengeContainer)}>
                                    <VersusIcon />
                                    <span className={styles.text}><FormattedMessage id="tabs.private_debates" /></span>
                                </div>
                            </Link>
                        </div>
                    }
                    { isLoggedIn ?
                        (
                            <div className={cx(styles.modalItem, {[styles.active]: isActive(props.location.pathname, props.routes.userShowLocation.path)})} onClick={hideModal}>
                                <Link className={cx(styles.itemContainer, {[styles.activeItem]: isActive(props.location.pathname, props.routes.userShowLocation.path)})} to={props.routes.userShowLocation.toUrl({ userSlug: currentUser.slug })} data-tid={"view_user_profile"}>
                                    <div data-tid={"view_user_profile"} className={styles.profile}>
                                        <Avatar
                                            avatarUrl={currentUser.image_url}
                                            userName={currentUser.full_name}
                                            size={24}
                                            data-tid={"view_user_profile"}
                                        />
                                        <span className={styles.text}><FormattedMessage id="info.profile" /></span>
                                    </div>
                                </Link>
                            </div>
                        ) 
                    :
                        <div className={styles.modalItem} data-tid={"action_login_link"} onClick={showLoginModal}>
                            <div className={styles.itemContainer} data-tid={"action_login_link"} >
                                <LoginIcon />
                                <span className={styles.text}><FormattedMessage id="action.sign_in" /></span>
                            </div>
                        </div>
                    }
                </div>
            </div>
            <div className={styles.mobileExitButton} onClick={hideModal}>
                <MobileCloseIcon width={50} height={50} />
            </div>
        </Modal>
    )
}

export default withConfig(withRouter(NavbarModal));
