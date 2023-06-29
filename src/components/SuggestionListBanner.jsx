import React from 'react';
import styles from './SuggestionListBanner.module.scss';
import { ArrowIcon } from "@logora/debate.icons";
import { FormattedMessage } from 'react-intl';
import { useAuth } from "@logora/debate.auth.use_auth";
import SuggestionListBlankBox from './SuggestionListBlankBox';
import cx from 'classnames';

const SuggestionListBanner = (props) => {
    const { isLoggedIn, authError } = useAuth();
    return (
        <div className={styles.container}>
            <div className={styles.suggestionBox}>
                <SuggestionListBlankBox />
            </div>
            <div className={styles.ctaBox}>
                <span><FormattedMessage id="suggestion.user_action" /></span>
                <div className={cx(styles.button, { [styles.disabled]: props.disabled && isLoggedIn })} onClick={props.onClick}>
                    <span><FormattedMessage id="suggestion.suggest" /></span>
                    <ArrowIcon width={25} height={25} />
                </div>
                {props.disabled && isLoggedIn &&
                    <div className={styles.pointsRestriction}>
                        <span><FormattedMessage id="info.suggestion.points" defaultMessage={"For posting a suggestion you need to reach"} /></span>
                        <br/>
                        <span><FormattedMessage id="info.point_eloquence" values={{variable: 100}} /></span>
                    </div>
                }
            </div>
        </div>
      )
}

export default SuggestionListBanner