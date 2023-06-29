import React, { useEffect, useState } from 'react';
import { useConfig } from '@logora/debate.context.config_provider';
import { FormattedMessage, useIntl } from 'react-intl';
import { Modal, useModal } from '@logora/debate.dialog.modal';
import { ArgumentSummaryBox } from '@logora/debate.summary.argument_summary_box';
import { KeywordBox } from '@logora/debate.summary.keyword_box';
import SynthesisLineChart from '../chart/SynthesisLineChart';
import VotePaginatedList from '../VotePaginatedList';
import Argument from '../Argument';
import styles from './DebateSummary.module.scss';
import cx from 'classnames';
import BoxSkeleton from '@logora/debate.skeleton.box_skeleton';
import { useRelativeTime } from '@logora/debate.hooks.use_relative_time';

const KeywordContributionsModal = (props) => {
    return (
        <Modal>
            <div style={{ backgroundColor: props.color }} className={styles.contributionsModalTitle}>
                { props.keyword }
            </div>
            <div className={styles.contributionsModal}>
                <VotePaginatedList 
                    currentListId={`argumentListSummary`}
                    display={"column"}
                    resourcePropName="argument"
                    perPage={5}
                    currentPage={1}
                    resource={"messages"}
                    withPagination={false}
                    staticContext={props.staticContext}
                    staticResourceName={props.staticResourceName}				
                    query={props.keyword}
                    filters={{ group_id: props.debate.id, status: "accepted", is_reply: false }}
                >
                    <Argument
                        isTrimmedArgument={false}
                        debatePositions={props.debate.group_context.positions}
                        debateName={props.debate.name}
                        debateGroupContext={props.debate.group_context}
                        debateSlug={props.debate.slug}
                        debateIsActive={props.debate.is_active}
                    />
                </VotePaginatedList>
            </div>
        </Modal>
    )
}

const DebateSummary = (props) => {
    const config = useConfig();
    const intl = useIntl();
    const [summaryFirstPosition, setSummaryFirstPosition] = useState([]);
    const [summarySecondPosition, setSummarySecondPosition] = useState([]);
    const [keywords, setKeywords] = useState([]);
    const [isLoadedFirstPosition, setIsLoadedFirstPosition] = useState(false);
    const [isLoadedSecondPosition, setIsLoadedSecondPosition] = useState(false);
    const [isLoadedKeywords, setIsLoadedKeywords] = useState(false);
    const { showModal } = useModal();

    useEffect(() => {
        if (props.debate.has_summary === true) {
            fetch(`https://nlp.logora.fr/analysis/argument-summary-${props.debate.id}-${props.debate.group_context.positions[0].id}`)
                .then(response => response.json())
                .then(json => {
                    setSummaryFirstPosition(json.data) 
                    setIsLoadedFirstPosition(true)})
                .catch(error => console.error(error));

            fetch(`https://nlp.logora.fr/analysis/argument-summary-${props.debate.id}-${props.debate.group_context.positions[1].id}`)
                .then(response => response.json())
                .then(json => {
                    setSummarySecondPosition(json.data) 
                    setIsLoadedSecondPosition(true)})
                .catch(error => console.error(error));

            fetch(`https://nlp.logora.fr/analysis/keyphrase-extraction-${props.debate.id}`)
                .then(response => response.json())
                .then(json => {
                    setKeywords(json.data) 
                    setIsLoadedKeywords(true)})
                .catch(error => console.error(error));
        }
    }, []);

    const keywordsColor = ["#FBC62F", "#00C7F2", "#F7A23B", "#F75D5F", "#0FCA7A"];

    const capitalizeFirstLetter = (keyword) => {
        return keyword.charAt(0).toUpperCase() + keyword.slice(1);
    }

    const openContributionsDrawer = (keyword, index) => {
        showModal(
            <KeywordContributionsModal keyword={keyword} debate={props.debate} color={keywordsColor[index]}/>
        )
    }

    return (
        <div>
            {props.debate.has_summary ? 
                <>
                    <div className={styles.section}>
                        {intl.formatMessage({ id: "summary.description.summary" })}
                        {isLoadedFirstPosition && summaryFirstPosition && 
                            <div className={styles.date}>
                                {intl.formatMessage({ id: "summary.description.update" })}
                                <span className={styles.updateDate}>{useRelativeTime(new Date(summaryFirstPosition.ended_at).getTime())}</span>
                            </div>
                        }

                    </div>
                    <div className={styles.sectionLine}>
                        <div className={styles.title}>{intl.formatMessage({ id: "summary.title.summary" })}</div>
                        <div className={styles.description}>{intl.formatMessage({ id: "summary.description.argument_summary" })}</div>
                        {(!isLoadedFirstPosition || !isLoadedSecondPosition) && <div className={styles.analysisInProgress}>{intl.formatMessage({ id: "summary.argument_summary_box.in_progress" })}</div>}
                        <div className={styles.argumentsListContainer}>
                            <div className={cx(styles.positionList, styles.firstPositionList, {[styles.argumentSkeleton]: !isLoadedFirstPosition || !summaryFirstPosition})}>
                                {isLoadedFirstPosition && summaryFirstPosition?.content?.arguments.length > 0 ? summaryFirstPosition.content.arguments.map((e) => (
                                    <ArgumentSummaryBox
                                        key={e.id} 
                                        label={intl.formatMessage({ id: "summary.argument_summary_box.label" })}
                                        text={e.argument}
                                        gauge={e.weight}
                                        color={config.theme.forPrimaryColor}
                                        tag={props.debate.group_context.positions[0].name}
                                    />))
                                :
                                    <BoxSkeleton onlyEdgeBox boxHeight={120} />
                                }
                            </div>
                            <div className={cx(styles.positionList, styles.secondPositionList, {[styles.argumentSkeleton]: !isLoadedSecondPosition || !summarySecondPosition})}>
                                {isLoadedSecondPosition && summarySecondPosition?.content?.arguments.length > 0 ? summarySecondPosition.content.arguments.map((e) => (
                                    <ArgumentSummaryBox
                                        key={e.id} 
                                        label={intl.formatMessage({ id: "summary.argument_summary_box.label" })}
                                        text={e.argument}
                                        gauge={e.weight}
                                        color={config.theme.againstPrimaryColor}
                                        tag={props.debate.group_context.positions[1].name}
                                    />))
                                :
                                    <BoxSkeleton onlyEdgeBox boxHeight={120} />
                                }
                            </div>
                        </div>
                    </div>
                    <div className={styles.sectionLine}>
                        <div className={styles.title}>{intl.formatMessage({ id: "summary.title.text" })}</div>
                        <div className={styles.description}>{intl.formatMessage({ id: "summary.description.text" })}</div>
                        {!isLoadedKeywords && 
                            <>
                                <div className={styles.analysisInProgress}>{intl.formatMessage({ id: "summary.argument_summary_box.in_progress" })}</div>
                                <div className={styles.keywordSkeletonContainer}>
                                    <div className={styles.keywordSkeleton}><BoxSkeleton onlyEdgeBox boxHeight={120} /></div>
                                    <div className={styles.keywordSkeleton}><BoxSkeleton onlyEdgeBox boxHeight={120} /></div>
                                    <div className={styles.keywordSkeleton}><BoxSkeleton onlyEdgeBox boxHeight={120} /></div>
                                    <div className={styles.keywordSkeleton}><BoxSkeleton onlyEdgeBox boxHeight={120} /></div>
                                </div>
                            </>
                        }
                        <div className={styles.keywordsContainer}>
                            {isLoadedKeywords && keywords?.content?.keyphrases.length > 0 && keywords.content.keyphrases.slice(0, 5).map((keyword, index) => 
                                <KeywordBox key={keyword.id} debate={props.debate} keyword={`${index + 1}. ${capitalizeFirstLetter(keyword.name)}`} occurrences={keyword.frequency || 0} color={keywordsColor[index]} handleClick={() => openContributionsDrawer(keyword.name, index)} />)}
                        </div>
                    </div>
                    <div className={styles.sectionLine}>
                        <div className={styles.title}>{intl.formatMessage({ id: "summary.title.interaction" })}</div>
                        <div className={styles.description}>{intl.formatMessage({ id: "summary.description.interaction" })}</div>
                        <SynthesisLineChart 
                            contentId={props.debate.id}
                            startDate={props.debate.created_at}
                            endDate={new Date().toISOString()}
                            contentRoute={"messages_stats"}
                            votesRoute={"votes_stats"}
                            dataKeyId={"group_id"}
                            contentLabel={intl.formatMessage({ id: "summary.line_chart.arguments" })}
                            votesLabel={intl.formatMessage({ id: "summary.line_chart.votes" })}
                            contentColor={config.theme.firstPositionColorPrimary}
                            votesColor={config.theme.secondPositionColorPrimary}
                            // tags={[{name: props.debate.group_context.positions[0].name, id: props.debate.group_context.positions[0].id}, {name: props.debate.group_context.positions[1].name, id: props.debate.group_context.positions[1].id}]}
                        />
                    </div>
                </>
            :
                <div className={styles.fallbackContainer}>
                    <FormattedMessage id="summary.fallback" defaultMessage={"The debate does not yet have enough arguments to calculate a synthesis."} />
                </div>
            }
        </div> 
    );
}

export default DebateSummary;
