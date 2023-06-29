import React, { lazy, Suspense } from 'react';
import styles from './NavbarButton.module.scss';
import { MobileMenuIcon } from '@logora/debate.icons';
import { withConfig } from '@logora/debate.context.config_provider';
import { useModal } from '@logora/debate.dialog.modal';
import { withResponsive } from "@logora/debate.hooks.use_responsive";
import cx from "classnames";
const NavbarModal = lazy(() => import('./NavbarModal'));

const NavbarButton = (props) => {
	const { showModal } = useModal();

    const handleShowModal = () => {
        showModal(<Suspense fallback={null}><NavbarModal /></Suspense>);
    }

    return (
        <div className={cx(styles.mobileIcon, {[styles.mobileIconDrawer]: props.config.isDrawer})} onClick={() => handleShowModal()} data-tid={"action_view_mobile_navigation"}>
            {props.isMobile && <MobileMenuIcon width={50} height={50} /> }
        </div>
    )
}

export default withResponsive(withConfig(NavbarButton));
