import React from 'react';
import styles from './InformationBox.module.scss';
import { PointIcon, ArrowIcon } from '@logora/debate.icons';
import { Link } from 'react-router-dom';
import cx from 'classnames';
import { useIntl, FormattedPlural } from "react-intl";

export const InformationBox = (props) => {
    const Icon = props.icon;
    const intl = useIntl();

    return (
        <div className={styles.container}>
            <div className={cx(styles.title, {[styles.stroke]: props.stroke})}>
                { props.icon && <Icon height={28} width={28} data-testid={"icon"} /> }
                <span>{ props.title }</span>
            </div>
            <div className={styles.point}>
                <span className={styles.pointNumber}>
                    <span className={styles.textSpacing}>{intl.formatMessage({ id: "information.information_box.from", defaultMessage: "From" })}</span>
                    <span className={styles.textSpacing}>{ props.points }</span>
                    <FormattedPlural value={props.points} one={intl.formatMessage({ id: "information.information_box.eloquence_point", defaultMessage: "eloquence point"})} other={intl.formatMessage({ id: "information.information_box.eloquence_point_plural", defaultMessage: "eloquence points"})} />
                </span>
                <PointIcon width={22} height={22} />
            </div>
            <div className={styles.text}>
                <span>{ props.description }</span>
            </div>
            {props.isActive ?
                <div className={styles.link}>
                    <Link to={props.link}>
                        <span>{ props.textLink }</span>
                        <ArrowIcon width={22} height={22} />
                    </Link>
                </div>
            :
                <span className={styles.moduleNotActive}>{intl.formatMessage({ id: "information.information_box.module_not_active", defaultMessage: "Module not available on this debate space" })}</span>
            }
        </div>
  )
};