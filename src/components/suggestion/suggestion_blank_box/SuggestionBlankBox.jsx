import React from 'react';
import styles from './SuggestionBlankBox.module.scss';
import { useIntl } from "react-intl";
import { useRoutes } from '@logora/debate.context.config_provider';
import { LinkButton } from '@logora/debate.action.link_button';

export const SuggestionBlankBox = (props) => {
    const intl = useIntl();
    const routes = useRoutes();

    return (
        <>
            <div className={styles.suggestionBlankBox}>
                <div className={styles.suggestionHeader}>
                    <div className={styles.authorBox}>
                        <div className={styles.suggestionPlaceholderRound}></div>
                        <div className={styles.suggestionHeaderPlaceholderBox}>
                            <div className={styles.suggestionPlaceholderMargin}></div>
                            <div className={styles.suggestionPlaceholder}></div>
                        </div>
                    </div>
                </div>
                <div className={styles.suggestionButton}>
                    <LinkButton data-tid={"action_add_suggestion"} to={ routes.suggestionLocation.toUrl() }>
                        { intl.formatMessage({ id:"suggestion.suggestion_blank_box.add_suggestion", defaultMessage:"Add suggestion" }) }
                    </LinkButton>
                </div>
                <div className={styles.suggestionBody}>
                    <div className={styles.suggestionContent}>
                        <div className={styles.suggestionPlaceholderMargin}></div>
                        <div className={styles.suggestionPlaceholder}></div>
                    </div>
                </div>
                <div className={styles.suggestionFooter}>
                    <div className={styles.suggestionVoteContainer}>
                        <div className={styles.suggestionPlaceholderMarginFooter}></div>
                        <div className={styles.suggestionPlaceholderMarginCircleFooter}></div>
                        <div className={styles.suggestionPlaceholderMarginCircleFooter}></div>
                    </div>
                </div>
            </div>
        </>
    )
}