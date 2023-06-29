import React from "react";
import styles from "./IconTextLink.module.scss";
import { Link } from "@logora/debate.action.link";
import cx from "classnames";

export const IconTextLink = props =>  {
    const { className, to, icon, text, active, children, pinText, pin, ...rest } = props;

	const displayIconText = () => {
		const Icon = icon;
		return (
			<div data-testid={"iconTextContainer"} className={cx(styles.iconTextContainer, {[styles.active]: active})} {...(to ? {} : {...rest})}>
				<div className={styles.iconPinContainer}>
					{ pin &&
						<span
							className={pinText ? styles.pinWithText : styles.pin}
							id='notification_count'
							data-notification-count={pinText}
						>
							{pinText ? pinText : ""}
						</span>
					}
					{ icon ? 
						<Icon data-testid={"icont-text-icon"} height={24} width={24} /> 
					: 
						children
					}
				</div>
				<div className={styles.iconText}>
					{ text }
				</div>
			</div>
		);
	};

	return (
		<>
			{to ? (
				<Link data-testid={"iconTextLink"} to={to} className={cx(styles.iconTextLink, className)} {...rest}>
					{ displayIconText() }
				</Link>
			) : (
				displayIconText()
			)}
		</>
	);
}
