import React, {useState, useEffect} from "react";
import { useIntl, FormattedMessage } from 'react-intl';
import SynthesisLineChart from "../chart/SynthesisLineChart";
import SynthesisPieChart from "../chart/SynthesisPieChart";
import { SectionBox } from '@logora/debate.section.section_box';
import { PaginatedList } from "@logora/debate.list.paginated_list";
import ProposalSynthesisBox from "../ProposalSynthesisBox";
import UserContentSkeleton from '@logora/debate.skeleton.user_content_skeleton';
import styles from "./ConsultationSynthesis.module.scss";
import { useConfig } from '@logora/debate.context.config_provider';

const ConsultationSynthesis = (props) => {
    const [consultationTags, setConsultationTags] = useState([{id: null , display_name: "tout", name: "aaa"}]);
    const [activeTagId, setActiveTagId] = useState(null);
    const intl = useIntl();
    const config = useConfig();

    useEffect(() => {
        setConsultationTags([...consultationTags, ...props.consultation.tags].sort((a, b) => {return (a['name'].localeCompare(b['name'], 'fr', {ignorePunctuation: true}))}));
    }, [])


    return (
        <>
            <SectionBox titleText={intl.formatMessage({ id:"consultation.synthesis.presentation" })}>
                <div className={styles.synthesisContainer}>
                    <span>
                        { props.consultation.synthesis_description || <FormattedMessage id="consultation.synthesis_header" /> }
                    </span>
                </div>
            </SectionBox>
            <SectionBox titleText={intl.formatMessage({ id:"consultation.synthesis.best_proposals" })}>
                <div className={styles.synthesisContainer}>
                    <span className={styles.synthesisDescription}>
                        <FormattedMessage id="consultation.synthesis.description" />
                    </span>
                    <div className={styles.synthesisProposalContainer}>
                        <PaginatedList 
                            currentListId={"synthesisProposalsList"}
                            filters={{"top_by_tag": true, "status": "accepted", "consultation_id" : props.consultation.id, "is_consultation_expert": false, ...(activeTagId && {"tag_id": activeTagId})}}
                            loadingComponent={<UserContentSkeleton />}
                            resourcePropName={'proposal'} 
                            resource={'proposals'} 
                            perPage={6}
                            numberElements={props.consultation.tags.length || 0}
                        >
                            <ProposalSynthesisBox />
                        </PaginatedList>
                    </div>
                </div>
            </SectionBox>
            
            <SectionBox titleText={intl.formatMessage({ id:"consultation.synthesis.stats" })}>
                {props.consultation.tags.length > 1 &&
                    <div className={styles.synthesisPieChartsContainer}>
                        <SynthesisPieChart consultation={props.consultation} statsType={"proposals"} titleKey={"consultation.pie.proposal_title"} />
                        <SynthesisPieChart consultation={props.consultation} statsType={"votes"} titleKey={"consultation.pie.vote_title"}/>
                    </div>
                }
                <div className={styles.statsContainer}>
                    <SynthesisLineChart 
                        title={intl.formatMessage({ id: "consultation.chart_title" })}
                        contentId={props.consultation.id}
                        startDate={props.consultation.created_at}
                        endDate={props.consultation.ends_at}
                        contentRoute={"proposals_stats"}
                        votesRoute={"votes_stats"}
                        dataKeyId={"consultation_id"}
                        contentLabel={intl.formatMessage({ id: "consultation.line_chart.proposals" })}
                        votesLabel={intl.formatMessage({ id: "consultation.line_chart.votes" })}
                        contentColor={config.theme.firstPositionColorPrimary}
                        votesColor={config.theme.secondPositionColorPrimary}
                        tags={props.consultation.tags}
                        className={styles.synthesisLineChart}
                    /> 
                </div>
            </SectionBox>
        </>
    )
}

export default ConsultationSynthesis;