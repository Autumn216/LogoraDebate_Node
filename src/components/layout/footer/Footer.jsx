import React from 'react';
import styles from './Footer.module.scss';
import { useIntl } from "react-intl";
import { LogoraIcon } from '@logora/debate.icons';

export const Footer = (props) => {
	const intl = useIntl();

    return (
		<div className={styles.footer}>
			<div className={props.hideMargins === true ? styles.footerContainerFullWidth : styles.footerContainer}>
				<div className={styles.footerCreditBox}>
					<a href="https://logora.fr/moderation" target="_blank" rel="noopener noreferrer" role="link">
						{ intl.formatMessage({ id: "layout.footer.user_guide", defaultMessage: "User guide" }) }
					</a>
					<a href="https://6ao8u160j88.typeform.com/to/mjcnSNqD" target="_blank" rel="noopener noreferrer" role="link">
						{ intl.formatMessage({ id: "layout.footer.bug_report", defaultMessage: "Suggest an improvement" }) }
					</a>
					<a href="https://logora.fr/cgu" target="_blank" rel="noopener noreferrer" role="link">
						{ intl.formatMessage({ id: "layout.footer.terms", defaultMessage: "Terms" }) }
					</a>
					<div className={styles.linkViewLogora}>
						<LogoraIcon width="20" height="20" className={styles.logo}/>
						<a data-tid={"link_view_logora"} href="https://logora.fr/" target="_blank" rel="noopener noreferrer" role="link">
							{ intl.formatMessage({ id: "layout.footer.made_by_logora", defaultMessage: "Powered by Logora" }) }
						</a>
					</div>
				</div>
			</div>
		</div>
    );
}
