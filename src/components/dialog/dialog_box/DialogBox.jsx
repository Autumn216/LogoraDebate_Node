import React, { useState, useEffect } from 'react';
import cx from 'classnames';
import styles from './DialogBox.module.scss';
import { ChatIcon, PointIcon } from '@logora/debate.icons';
import { useConfig } from '@logora/debate.context.config_provider';
import { FormattedMessage } from 'react-intl';

export const DialogBox = (props) => {
    const storedChoice = JSON.parse(typeof window !== "undefined" && window.localStorage && window.localStorage.getItem(props.contentKey)) || false;
    const [show, setShow] = useState(true);
    const config = useConfig();

    useEffect(() => {
    }, [props.isHidden]);

    const closeBox = () => {
        setShow(false);
        if(typeof window !== "undefined") {
            window.localStorage.setItem(props.contentKey, true);
        }
    }

    return (
        <div className={styles.childContainer}>
            {props.children}
            {!storedChoice && !props.isHidden &&
                <div className={cx(styles.textContainer, props.className, {[styles.hidden]: !show, [styles.left]: props.isLeft, [styles.right]: props.isRight, [styles.top]: props.isTop, [styles.bottom]: props.isBottom})}>
                    <div className={styles.close} onClick={closeBox}>x</div>
                    <div className={styles.title}>
                        <ChatIcon width={20} heigth={20} {...(config.theme.iconTheme === "edge" && {variant: "edge"})} />
                        <span><FormattedMessage id={props.titleKey} defaultMessage="Debates" /></span>
                    </div>
                    <div className={styles.textContent}>
                        <span><FormattedMessage id={props.contentKey} defaultMessage="Participate by writing your argument and earn eloquence points" /></span>
                        {props.isPoints && <PointIcon width={15} heigth={15} />}
                    </div>
                    <div className={styles.closeText} onClick={closeBox}>
                        <span><FormattedMessage id="info.got_it" defaultMessage="Got it" /></span>
                    </div>
                </div>
            }
        </div>
    )
}