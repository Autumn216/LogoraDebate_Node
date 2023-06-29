import React from 'react';
import cx from 'classnames';
import styles from './Tag.module.scss';

export const Tag = (props) => {
    return (
        <span data-tid={props.dataTid ? props.dataTid : null} className={cx(styles.tag, styles.className, { [styles.active]: props.active })}>{ props.text }</span>
    )
}