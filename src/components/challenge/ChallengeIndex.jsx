import React, { useState, useEffect, lazy, Suspense } from 'react';
import { withRouter } from 'react-router';
import { useModal } from '@logora/debate.dialog.modal';
import { withAuth } from "@logora/debate.auth.use_auth";
import { useIntl } from "react-intl";
import { useAuthenticationRequired } from "@logora/debate.hooks.use_authentication_required";
import qs from "querystringify";
import ChallengeBox from './ChallengeBox';
import BoxSkeleton from '@logora/debate.skeleton.box_skeleton';
import { PaginatedList } from "@logora/debate.list.paginated_list";
const ChallengeCreateModal = lazy(() => import('./ChallengeCreateModal'));
const ChallengeInvitationAnswerModal = lazy(() => import('./ChallengeInvitationAnswerModal'));
import styles from './ChallengeIndex.module.scss';

const ChallengeIndex = (props) => {
    const intl = useIntl();
    const { showModal } = useModal();
    const [invitationUid, setInvitationUid] = useState(undefined);
	const requireAuthentication = useAuthenticationRequired();

    useEffect(() => {
        if (typeof window !== "undefined") {
            const values = qs.parse(props.location.search);
            const invitationUid = values.invitation_id;
			if (invitationUid) {
				setInvitationUid(invitationUid);
                showModal(
                    <Suspense fallback={null}>
                        <ChallengeInvitationAnswerModal
                            invitationUid={invitationUid}
                        />
                    </Suspense>
                );
			}
        }
    }, []);

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
        <div className={styles.header}>
            <div className={styles.description}>
                <div className={styles.title}>
                    { intl.formatMessage({ id: "tabs.private_debates" }) }
                </div>
                <span>{ intl.formatMessage({ id: "challenge.index.description" }) }</span>
            </div>
            <div data-tid={"action_create_challenge_index"} className={styles.createButton} onClick={() => openCreateModal()}>
                <span className={styles.buttonIcon}>+</span>
                <span className={styles.buttonTitle}>
                    { intl.formatMessage({ id: "challenge.start" }) }
                </span>
            </div>
        </div>
        <div className={styles.listContainer}>
            <PaginatedList 
                currentListId={"challengeList"}
                loadingComponent={<BoxSkeleton />}
                resourcePropName="debate"
                filters= { { "expired": false } }
                resource={'debates'} 
                perPage={6}
                searchBar={false}
                elementsPerLine={2}
                sortOptions={[
                    {
                        name: "recent",
                        value: "-created_at",
                        type: "sort",
                        text: intl.formatMessage({id: "info.sort_by_newest_challenge" }),
                    },
                    {
                        name: "old",
                        type: "sort",
                        value: "+created_at",
                        text: intl.formatMessage({id: "info.sort_by_oldest_challenge" }),
                    },
                ]}
            >
                <ChallengeBox />
            </PaginatedList>
        </div>
    </>
  )
}

export default withAuth(withRouter(ChallengeIndex));