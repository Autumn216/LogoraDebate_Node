import React, { lazy, Suspense } from 'react';
import { useModal } from '@logora/debate.dialog.modal';
import { withAuth } from "@logora/debate.auth.use_auth";
import { useAuthenticationRequired } from "@logora/debate.hooks.use_authentication_required";
import { FormattedMessage } from 'react-intl';
import styles from './ChallengeCreateBox.module.scss';
import cx from 'classnames';
const ChallengeCreateModal = lazy(() => import('./ChallengeCreateModal'));

const ChallengeCreateBox = props => {
  const { showModal } = useModal();
	const requireAuthentication = useAuthenticationRequired();
  const groupContext = props.challenge;
  const disabled = props.isLoggedIn && props.currentUser.points < 2000;

  const openCreateModal = (position) => {
    if(props.isLoggedIn) {
      showModal(
        <Suspense fallback={null}>
          <ChallengeCreateModal
            position={position}
            groupContext={groupContext}
          />
        </Suspense>
      );
    } else {
      requireAuthentication({});
    }
  }

  const displayPosition = (position, index) => {
    return (
        <div className={cx(styles.positionItem, styles[`position-${index + 1}`])} key={position.id} onClick={() => openCreateModal(position)}>
          {position.name}
        </div>
    )
  }

  const displayPositionDisabled = (position, index) => {
    return (
        <div className={cx(styles.positionItem, styles.positionItemDisabled, styles[`position-${index + 1}`])} key={position.id}>
          {position.name}
        </div>
    )
  }

  return (
    <div className={styles.challengeCreateBox}>
      <div className={styles.title}>{groupContext.name}</div>
      <div className={styles.choiceSection}><FormattedMessage id="challenge.choose_position" /></div>
      <div className={styles.positionsBox}>
        {disabled ?
          groupContext.positions.map(displayPositionDisabled)
        :
          groupContext.positions.map(displayPosition)
        }
      </div>
    </div>
  )
}

export default withAuth(ChallengeCreateBox);