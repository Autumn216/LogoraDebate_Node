import React, { useState } from 'react';
import { SmallArrowIcon } from '@logora/debate.icons';
import { ContextSourceBox } from "@logora/debate.source.context_source_box";
import { useIntl, FormattedPlural } from "react-intl";
import cx from 'classnames';
import styles from './ContextSourceList.module.scss';

export const ContextSourceList = (props) => {
    const intl = useIntl();
    const [isOpen, setIsOpen] = useState(false);

    const handleBox = () => {
        setIsOpen(!isOpen);
    }

    const displaySources = (source) => {
        return (
            <a href={source.source_url} role="link" key={source.id} target="_blank">
                <ContextSourceBox imageUrl={source.origin_image_url} author={source.publisher} title={source.title} date={source.published_date} />
            </a>
        )
    }

    return (
        <div className={styles.container}>
            <div className={cx(styles.header, {[styles.headerClosed]: !isOpen})} onClick={() => handleBox()}>
                <span>{intl.formatMessage({ id: "source.context_source_list.title", defaultMessage: "Debate context" })}</span>
                <span className={cx({[styles.svgClosed]: !isOpen})}><SmallArrowIcon width={20} height={20} /></span>
            </div>
            {isOpen &&
                <div className={cx(styles.box, {[styles.boxClosed]: !isOpen})}>
                    <div className={styles.title}>
                        <span><FormattedPlural value={props.sources.length} one={intl.formatMessage({ id: "source.context_source_list.article_plural", defaultMessage: "Article"})} other={intl.formatMessage({ id: "source.context_source_list.article_plural", defaultMessage: "Articles"})} /></span>
                    </div>
                    <div className={styles.content}>{props.sources.map(displaySources)}</div>
                </div>
            }
        </div>
    )
}