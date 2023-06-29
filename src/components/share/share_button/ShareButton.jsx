import React, { useState, useRef } from "react";
import { ShareIcon } from "@logora/debate.icons";
import { ShareBox } from "@logora/debate.share.share_box";
import { useIntl } from "react-intl";
import { useResponsive } from "@logora/debate.hooks.use_responsive";
import useOnClickOutside from 'use-onclickoutside';
import styles from "./ShareButton.module.scss";
import cx from "classnames";
import { useConfig } from '@logora/debate.context.config_provider';

export const ShareButton = (props) => {
	const popoverContentRef = useRef();
	const intl = useIntl();
	const [isMobile, isTablet, isDesktop] = useResponsive();
	const [popoverActive, setPopoverActive] = useState(false);
	const config = useConfig();

	const buildShareLink = () => {
        let shareUrl = props.shareUrl;
        if(typeof window !== 'undefined') {
            shareUrl += "?redirect_url=" + window.location.protocol + "//" + window.location.hostname;
        }
        return shareUrl;
    }

	const shareUrl = buildShareLink();

	const handleClickOutsidePopover = (event) => {
		if (popoverContentRef && !popoverContentRef.current.contains(event.target)) {
			setPopoverActive(false);
		}
	};

	const handleShare = () => {
		if ((typeof window !== 'undefined') && isMobile && window.navigator.share) {
			handleMobileShare();
		} else {
			setPopoverActive(true);
		}
	};

	const handleMobileShare = () => {
		window.navigator.share({
			text: props.shareText,
			title: props.shareTitle,
			url: shareUrl
		}).catch(error => {
			// DO NOTHING
		});
	}

	useOnClickOutside(popoverContentRef, handleClickOutsidePopover);

	return (
		<div
			title={intl.formatMessage({ id: "share_button_text", defaultMessage: "Share" })}
			className={cx(styles.shareButtonContainer, props.className)}
			tabIndex='0'
			onClick={handleShare}
		>
			<div
				className={cx(styles.popoverWrapper, { [styles.popoverActive]: popoverActive})}
			>
				<ShareIcon height={config.theme.iconTheme === "edge" ? 24 : 22} width={config.theme.iconTheme === "edge" ? 24 : 22} {...(config.theme.iconTheme === "edge" && {variant: "edge"})} />
				<div className={styles.shareButtonText}>{props.showText && intl.formatMessage({ id: "share_button_text", defaultMessage: "Share" })}</div>
				<div ref={popoverContentRef} className={cx(styles.popoverContent, {[styles.popoverContentWithCode]: props.showShareCode})}>
					{ popoverActive && <ShareBox shareUrl={shareUrl} shareTitle={props.shareTitle} shareText={props.shareText} showShareCode={props.showShareCode} shareCode={props.shareCode} /> }
				</div>
			</div>
		</div>
	);
}