import React from 'react';
import styles from './ContextSourceBox.module.scss';
import { FormattedDate } from 'react-intl';
import { OpenBlankIcon } from '@logora/debate.icons';

export const ContextSourceBox = (props) => {
  return (
    <div className={styles.container}>
        <img src={props.imageUrl} alt="" className={styles.image} />
        <div className={styles.content}>
            <div className={styles.infos}>
                <span className={styles.sourceAuthor}>{props.author}</span>
                <span className={styles.separator}>•</span>
                <span className={styles.sourcePublishedDate}><FormattedDate value={new Date(props.date)} year="numeric" month="long" day="2-digit" /></span>
            </div>
            <div className={styles.sourceTitle}>{props.title} <OpenBlankIcon width={10} height={10} /></div>
        </div>
    </div>
  )
}