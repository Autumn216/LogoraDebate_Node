import React from 'react';
import { LinkIcon } from '@logora/debate.icons';
import styles from './SourceListItem.module.scss';

export const SourceListItem = (props) => {
    return (
        <a className={styles.sourceListItem} role="link" href={props.url} target="_blank" rel="nofollow noreferrer noopener" data-tid={"link_view_source"}>
            <LinkIcon width={16} height={16} />
            <div className={styles.sourceListItemLink} >
                <span>[ {props.index + 1} ]</span> 
                <span>{props.publisher && `${props.publisher} - `} {props.title}</span>
            </div>
        </a>
    );
}
