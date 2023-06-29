import React from 'react';
import { AuthorBox } from '@logora/debate.user.author_box';
import { FormattedMessage } from 'react-intl';
import cx from 'classnames';
import styles from './ChallengeArgumentBlankBox.module.scss';

const ChallengeArgumentBlankBox = (props) => {
    return (
        <>
            <div className={cx(styles.argumentBlankBox)}>
                <>
                    <div className={styles.argumentHeader}>
                        {props.nextUser ?
                            <>
                                <div className={styles.authorBox}>
                                    <AuthorBox author={props.nextUser.user} />
                                </div>
                                <div className={cx(styles.authorPosition, { [styles.firstUserPosition]: props.positionIndex === 0})}>
                                    {props.nextUser.position.name}
                                </div>
                            </>
                        :
                            <div className={styles.privateDebateParticipantItem}>
                                <div className={styles.imageContainer}>
                                    <div className={styles.userImageBackground}>
                                        <div className={styles.userImageEmpty} width={40} height={40} />
                                    </div>
                                </div>
                                <div className={styles.userName}>
                                    <FormattedMessage id="closed_group.user_empty" />
                                </div>
                            </div>
                        }
                    </div>
                    <div className={styles.argumentBody}>
                        <div className={styles.argumentContent}>
                            <div className={styles.argumentPlaceholderMargin}></div>
                            <div className={styles.argumentPlaceholderMargin}></div>
                            <div className={styles.argumentPlaceholderMargin}></div>
                            <div className={styles.argumentInfo}>
                                <FormattedMessage id={props.textKey ? props.textKey : "info.duel_waiting_user"} />
                            </div>
                        </div>
                    </div>
                </>
            </div>
        </>
    );
}

export default ChallengeArgumentBlankBox;
export { ChallengeArgumentBlankBox as PureArgumentBlankBox };
