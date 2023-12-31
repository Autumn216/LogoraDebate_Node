import React from 'react';
import PropTypes from 'prop-types';
import { PointIcon } from '@logora/debate.icons';
import cx from 'classnames';
import styles from './AlertDialog.module.scss';

export const AlertDialog = ({ text, points, variant = "info", handleClose }) => {
    return (
        <div className={cx(styles.container, styles[variant])}>
            <div className={styles.body}>
                <div className={styles.message}>
                    { text }
                </div>
                { points &&
                    <div className={styles.points}>
                        <span className={styles.textPoints}>{points}</span>
                        <PointIcon width={20} height={20} />
                    </div>
                }
            </div>
            <div className={styles.closeContainer}>
                <div className={styles.closeButton} onClick={handleClose}>✕</div>
            </div>
        </div>
    );
}

AlertDialog.propTypes = {
    /** Text of the alert */
    text: PropTypes.string.isRequired,
    /** Points earned displayed below the text */
    points: PropTypes.string,
    /** Type of the alert, can be 'info', 'success' or 'error' */
    variant: PropTypes.string,
    /** On close callback */
    handleClose: PropTypes.func
};