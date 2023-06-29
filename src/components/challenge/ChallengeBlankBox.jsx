import React, { lazy, Suspense } from 'react';
import { withConfig } from '@logora/debate.context.config_provider';
import { useModal } from '@logora/debate.dialog.modal';
import { withAuth } from "@logora/debate.auth.use_auth";
import { useAuthenticationRequired } from "@logora/debate.hooks.use_authentication_required";
import { FormattedMessage } from 'react-intl';
const ChallengeCreateModal = lazy(() => import('./ChallengeCreateModal'));
import styles from './ChallengeBlankBox.module.scss';

const ChallengeBlankBox = (props) => {
    const { showModal } = useModal();
	const requireAuthentication = useAuthenticationRequired();

    const openCreateModal = () => {
		if(props.isLoggedIn) {
			showModal(
                <Suspense fallback={null}>
                    <ChallengeCreateModal
                        name={null}
                        positions={null}
                        opponent={null}
                        groupContext={null}
                        isIndex={true}
                    />
                </Suspense>
            );
		} else {
            requireAuthentication({});
		}
	}

    return (
        <>
            <div className={styles.challengeBannerContainer}>
                <div className={styles.challengeBannerTitle}>
                    <FormattedMessage id="challenge.banner_title" />
                </div>
                <div className={styles.challengeBlankBox}>
                    <div className={styles.challengeHeader}>
                        <div className={styles.challengeContent}>
                            <div className={styles.challengePlaceholder}></div>
                        </div>
                    </div>
                    <div className={styles.challengeButton} onClick={() => openCreateModal()}>
                        <FormattedMessage id="challenge.start" />
                    </div>
                    <div className={styles.challengeBody}>
                        <div className={styles.challengeBoxContainer}>
                            <div className={styles.challengeUserBox}></div>
                            <div className={styles.challengeUserBox}></div>
                        </div>
                    </div>
                    <div className={styles.challengeFooter}>
                        <div className={styles.challengeContent}>
                            <div className={styles.challengeSmallPlaceholder}></div>
                        </div>
                    </div>
                </div>
            </div>
        </>
      )
}

export default withAuth(withConfig(ChallengeBlankBox));