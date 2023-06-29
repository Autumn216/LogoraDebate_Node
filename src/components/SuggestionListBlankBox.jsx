import React from 'react';
import { FormattedMessage } from 'react-intl';
import { useAuth } from "@logora/debate.auth.use_auth";
import { Avatar } from "@logora/debate.user.avatar";
import { EllipsisIcon } from '@logora/debate.icons';
import styles from './SuggestionListBlankBox.module.scss';

const SuggestionListBlankBox = () => {
    const { currentUser } = useAuth();

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.authorBox}>
                    <Avatar avatarUrl={currentUser?.image_url} userName={currentUser?.full_name} size={40} />
                    { Object.keys(currentUser).length === 0 ?
                        <div className={styles.authorPlaceHolder}></div>
                    :
                        <div className={styles.authorFullName}>{currentUser.full_name}</div>
                    }
                </div>
                <div className={styles.selected}>
                    <FormattedMessage id="suggestion.selected" />
                </div>
            </div>
            <div className={styles.content}>
                <div className={styles.contentPlaceHolder}></div>
                <div className={styles.contentSmallPlaceHolder}></div>
            </div>
            <div className={styles.footer}>
                <div className={styles.progressBar}></div>
                <EllipsisIcon width={22} height={22} />
            </div>
        </div>
    )
}

export default SuggestionListBlankBox;