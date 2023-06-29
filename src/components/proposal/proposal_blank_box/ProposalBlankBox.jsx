import React from 'react';
import { useIntl } from 'react-intl';
import styles from './ProposalBlankBox.module.scss';

export const ProposalBlankBox = (props) => {
    const intl = useIntl();

    return (
        <div className={styles.proposalBlankBox}>
            <div className={styles.proposalHeader}>
                <div className={styles.authorBox}>
                    <div className={styles.proposalPlaceholderRound}></div>
                    <div className={styles.proposalHeaderPlaceholderBox}>
                        <div className={styles.proposalPlaceholderMargin}></div>
                        <div className={styles.proposalPlaceholder}></div>
                    </div>
                </div>
                <div className={styles.proposalBlankButton}>
                    <a role="link" className={styles.proposalBlankLink} href={props.redirectUrl}>
                        { intl.formatMessage({ id: "proposal.proposal_blank_box.button_label", defaultMessage: "Add proposal" }) }
                    </a>
                </div>
            </div>
            <div className={styles.proposalBody}>
                <div className={styles.proposalContent}>
                    <div className={styles.proposalPlaceholderMargin}></div>
                    <div className={styles.proposalPlaceholderMargin}></div>
                </div>
            </div>
        </div>
    )
}