import React from 'react';
import { Link } from '@logora/debate.action.link';
import { ArrowIcon } from "@logora/debate.icons";
import cx from 'classnames';
import styles from './BackLink.module.scss';

export const BackLink = (props) => {
    const { link, text, className, ...rest } = props;

    return (
        <Link role="link" href={link} className={cx(className, styles.backLink)} external {...rest}>
            <ArrowIcon height={24} width={24} />
            <span className={styles.arrowIcon}>
                {text}
            </span>
        </Link>
    );
}
