import React from 'react';
import { useIntl } from 'react-intl';
import { ArgumentHeader } from '@logora/debate.argument.argument_header'
import SuggestionBoxFooter from './SuggestionBoxFooter';
import styles from './SuggestionBox.module.scss';

const SuggestionBox = (props) => {
    const intl = useIntl();
    const startDate = new Date(props.suggestion.created_at);
    const endDate = new Date(props.suggestion.expires_at);

    const getTag = () => {
        if(props.suggestion.is_accepted) {
            return intl.formatMessage({ id: "suggestion.selected", defaultMessage: "Selected" });
        } else if(props.suggestion.is_expired === true || endDate < startDate) {
            return intl.formatMessage({ id: "suggestion.ended", defaultMessage: "Expired" });
        } else {
            return null;
        }
    }

    const getTagClassName = () => {
        if(props.suggestion.is_accepted) {
            return styles.selected;
        } else if(props.suggestion.is_expired === true || endDate < startDate) {
            return styles.expired;
        } else {
            return null;
        }
    }

    return (
        <div className={styles.container}>
            <ArgumentHeader 
                author={props.suggestion.author} 
                tag={getTag()}
                tagClassName={getTagClassName()}
                date={endDate < startDate ? null : endDate.getTime()} 
            />
            <div className={styles.suggestion}>
                {props.suggestion.name}
            </div>
            <div className={styles.footer}>
                <SuggestionBoxFooter suggestion={props.suggestion} />
            </div>
        </div>
    )
}

export default SuggestionBox;
