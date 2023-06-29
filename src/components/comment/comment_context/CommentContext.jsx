import React from 'react';
import BackLink from '@logora/debate.action.back_link';
import { FormattedDate, FormattedMessage } from 'react-intl';
import { ChatIcon } from '@logora/debate.icons';
import cx from 'classnames';
import styles from './CommentContext.module.scss';

export const CommentContext = ({ source }) => {
    return (
        <>
            <BackLink className={styles.backLink} data-tid={"link_back_source"} link={source.source_url} text={<FormattedMessage id={"comment.comment_context.redirect"} defaultMessage="Read the article" />} />
            <div className={styles.contextContainer}>
                <div className={cx(styles.articleInformations, {[styles.articleWithImage]: source.origin_image_url !== null})}>
                    <div className={styles.date}>
                        <span><FormattedDate value={new Date(source.published_date)} year="numeric" month="long" day="2-digit" /></span>
                    </div>
                    <div className={styles.title}>
                        <span>{source.title}</span>
                    </div>
                    <div className={styles.commentsCountBox}>
                        <ChatIcon width={17} height={17} />
                        <div className={styles.commentsCount}>{ source.comments_count || 0 }</div>
                    </div>
                </div>
                { source.origin_image_url &&
                    <div className={styles.articleImage}>
                        <img className={styles.contextImage} src={source.origin_image_url} alt={source.title} />
                    </div>
                }
            </div>
        </>
    )
}