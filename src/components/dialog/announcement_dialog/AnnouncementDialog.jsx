import React from 'react';
import styles from './AnnouncementDialog.module.scss';
import { AnnouncementIcon } from '@logora/debate.icons';
import cx from 'classnames';

export const AnnouncementDialog = (props) => {
    const Icon = props.icon;
    return (
        <div className={cx(styles.container, props.className, {[styles.fullWidth]: props.fullWidth})}>
            <div className={cx(styles.icon, props.iconClassName)}>
                {props.icon ?
                    <Icon height={24} width={24} data-testid={"custom-icon"} />
                :
                    <AnnouncementIcon height={24} width={24} data-testid={"announcement-icon"} />
                }
            </div>
            <div className={styles.content}>
                { props.message ? props.message : props.children }
            </div>
        </div>
    )
}