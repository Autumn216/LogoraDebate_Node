import React, { useState, useEffect, useMemo } from 'react';
import { useConfig } from '@logora/debate.context.config_provider';
import { useDataProvider } from '@logora/debate.data.data_provider';
import { InputProvider } from '@logora/debate.context.input_provider';
import { withLoading } from '@logora/debate.tools.with_loading';
import { useAuth } from "@logora/debate.auth.use_auth";
import { useIntl } from "react-intl";
import { useLocation } from "react-router-dom";
import { ConsultationContext } from '@logora/debate.consultation.consultation_context';
import { Tabs, TabList, Tab, TabPanel } from 'react-tabs';
import ProposalInput from '../ProposalInput';
import { HomeIcon } from '@logora/debate.icons';
import { Tag } from '@logora/debate.tag.tag';
import ConsultationSynthesis from './ConsultationSynthesis';
import VotePaginatedList from '../VotePaginatedList';
import { Helmet } from "react-helmet";
import UserContentSkeleton from '@logora/debate.skeleton.user_content_skeleton';
import Proposal from '../Proposal';
import cx from 'classnames';
import styles from './Consultation.module.scss';

const Consultation = (props) => {
	const config = useConfig();
	const intl = useIntl();
	const { isLoggedIn, currentUser } = useAuth();
	const defaultExpert = {
		description: null,
		first_name: null,
		last_name: "aaa",
		full_name: null,
		id: null,
		slug: null,
		image_url: null
	}
	const api = useDataProvider();
	const [consultation, setConsultation] = useState(props.staticContext ? props.staticContext["getConsultation"] : {});
	const [consultationTags, setConsultationTags] = useState([{id: null , display_name: "tout", name: "aaa"}]);
	const [consultationExperts, setConsultationExperts] = useState([defaultExpert]);
	const [activeTagId, setActiveTagId] = useState(null);
	const [activeExpertId, setActiveExpertId] = useState(null);
	const [extraProposalId, setExtraProposalId] = useState(undefined);
	const location = useLocation();
	const seed = useMemo(() => Math.random(), []);

	useEffect(() => {
		const { consultationSlug } = props.match.params;
		loadConsultation(consultationSlug);
		if (typeof window !== "undefined") {
			let pageAnchor = location.pathname + location.hash.slice(1);
			const result = pageAnchor.split("proposal_");
			if (result.length > 1) {
				let proposalId = result[1];
				setExtraProposalId(proposalId);
			}
		}
	}, [])

	const loadConsultation = (consultationSlug) => {
		api.getOne("consultations", consultationSlug, {}).then(response => {
			if(response.data.success) {
				const consultation = response.data.data.resource;
				setConsultation(consultation);
				if (consultation.default_tag) { setActiveTagId(consultation.default_tag) }
				if (consultation.tags.length < 2) {
					setConsultationTags(consultation.tags);
				} else {
					setConsultationTags([...consultationTags, ...consultation.tags].sort((a, b) => {return (a['name'].localeCompare(b['name'], 'fr', {ignorePunctuation: true}))}));
				}
				setConsultationExperts([...consultationExperts, ...consultation.experts].sort((a, b) => {return (a['last_name'].localeCompare(b['last_name'], 'fr', {ignorePunctuation: true}))}));
				props.setIsLoading(false);
			} else {
				setLoadError(true);
			}
		}).catch(
			error => {
				setLoadError(true);
		});
	}

	const displayTags = (tag) => {
		return (
			<div className={styles.tagItem} key={tag.id} onClick={() => setActiveTagId(tag.id == activeTagId ? null : tag.id)}>
				<Tag active={activeTagId == tag.id || consultation.tags.length < 2 ? true : false} text={tag.display_name} />
			</div>
		);
	}

	const displayExpert = (expert) => {
		return (
			<div className={styles.expertItem} key={expert.id} onClick={() => setActiveExpertId(expert.id == activeExpertId ? null : expert.id)}>
				{ 
					expert.image_url ?
					<img className={activeExpertId === expert.id && styles.activeUser} alt={expert.first_name + " " + expert.last_name} src={expert.image_url} width={60} height={60}/>
					: <div className={activeExpertId === expert.id ? cx(styles.allExpert, styles.activeUser) : styles.allExpert}><HomeIcon width={27} height={25} /></div>
				}
				{ 
					expert.first_name && expert.last_name ? 
					<span className={activeExpertId === expert.id && styles.activeUser}>{String(expert.first_name).slice(0, 1) + "."}&nbsp;{expert.last_name}</span> 
					: <span className={activeExpertId === expert.id && styles.activeUser}>{ intl.formatMessage({id: "consultation.all_experts" }) }</span>
				}
			</div>
		);
	}

	const getSortOptions = () => {
		const sortOptions = []
		const date = new Date();
		const endDate = new Date(consultation.ends_at);
		const consultationFinished = date > endDate;
		if(consultationFinished) {
			sortOptions.push({ value: "-support_score", type: "sort", name: "support", text: intl.formatMessage({id: "info.sort_by_most_supported" }) });
			sortOptions.push({ value: "-controversy_score", type: "sort", name: "controversy", text: intl.formatMessage({id: "info.sort_by_most_controversial" }) });
			sortOptions.push({ value: "-created_at", type: "sort", name: "recent", text: intl.formatMessage({id: "info.sort_by_newest" }) });
		} else {
			sortOptions.push({ value: seed, type: "filter", name: "random_with_recency", dataTid: "action_sort_user_arguments_is_reply", text: intl.formatMessage({id: "info.sort_by_random" }) });
			sortOptions.push({ value: "-created_at", type: "sort", name: "recent", text: intl.formatMessage({id: "info.sort_by_newest" }) });
			sortOptions.push({ value: "-support_score", type: "sort", name: "support", text: intl.formatMessage({id: "info.sort_by_most_supported" }) });
			sortOptions.push({ value: "-controversy_score", type: "sort", name: "controversy", text: intl.formatMessage({id: "info.sort_by_most_controversial" }) });
		}
		if (isLoggedIn) {
			sortOptions.push({ name: "user_id", type: "filter", value: currentUser.id, text: intl.formatMessage({id: "consultation.proposal" }) });
		}
		return sortOptions;
	}

	const tabIndexInit = () => {
		const anchor = location.hash;
		if(!anchor) return 0;
		if(anchor == "#proposals") {
			return 0;
		} else if(anchor == "#candidates") {
			return 1;
		} else if(anchor == "#summary") {
			return 2;
		}
		return 0;
	}

	const date = useMemo(() => new Date());
    const endDate = new Date(consultation.ends_at);

	return (
		<>
			{ props.isLoading ? 
				null 
			:
				(
					<>
						{ config.isDrawer !== true &&
							<Helmet>
								<title>{ consultation.title + " - " + config.provider.name }</title>
								<meta name="description" content={intl.formatMessage({ id: "metadata.consultation_description" }, { consultation_title: consultation.title }) } />
								<meta property="og:title" content={ consultation.title } />
								<meta property="og:description" content={intl.formatMessage({ id: "metadata.consultation_description" }, { consultation_title: consultation.title }) }  />
								<meta property="og:type" content="article" />
								<meta property="og:image" content={consultation.image_ur} />
								<meta property="og:site_name" content={config.provider.name} />
								{ (typeof window !== "undefined") &&
									<meta property="og:url" content={window.location.href.split(/[?#]/)[0]} />
								}
								{ (typeof window !== "undefined") &&
									<link rel='canonical' href={window.location.href.split(/[?#]/)[0]} />
								}
							</Helmet>
						}
						<ConsultationContext consultation={consultation} disabled={date > endDate} />
						<div className={styles.consultationContainer}>
							<Tabs defaultIndex={tabIndexInit()}>
								<TabList className={styles.navTabs}>
									<Tab className={cx(styles.navItem, styles.navLink)} selectedClassName={styles.active}>
										{ intl.formatMessage({ id: "consultation.tabs.proposals" }) }
									</Tab>
									{consultation.experts.length > 0 &&
										<Tab className={cx(styles.navItem, styles.navLink)} selectedClassName={styles.active}>
											{ intl.formatMessage({ id: "consultation.tabs.experts" }) }
										</Tab>
									}
									<Tab className={cx(styles.navItem, styles.navLink)} selectedClassName={styles.active}>
										{ intl.formatMessage({ id: "consultation.tabs.synthesis" }) }
									</Tab>
								</TabList>
								<TabPanel selectedClassName={styles.tabPane}>
									<InputProvider>
										<ProposalInput consultation={consultation} disabled={date > endDate} />
									</InputProvider>
									{consultation.tags && <div className={styles.consultationTagList}>{consultationTags.map(displayTags)}</div>}
									<VotePaginatedList 
										voteableType={"Proposal"}
										currentListId={"proposalsList"}
										sortOptions={getSortOptions()}
										filters={{"status": "accepted", "consultation_id" : consultation.id, "is_consultation_expert": false, ...(activeTagId && {"tag_id": activeTagId}), ...(extraProposalId && {"proposal_id": extraProposalId})}}
										loadingComponent={<UserContentSkeleton />}
										resource={'proposals'} 
										resourcePropName="proposal"
										staticContext={props.staticContext}
										staticResourceName={"getProposals"}
										perPage={10}
										searchBar={true}
									>
										<Proposal disabled={date > endDate} />
									</VotePaginatedList>
								</TabPanel>
								{consultation.experts.length > 0 &&
									<TabPanel selectedClassName={styles.tabPane}>
										{consultation.experts && <div className={styles.consultationExpertImageList}>{consultationExperts.map(displayExpert)}</div>}
										{consultation.tags && <div className={styles.consultationTagList}>{consultationTags.map(displayTags)}</div>}
										<VotePaginatedList 
											currentListId={"expertProposalsList"}
											sortOptions={[
												{ value: seed, type: "filter", name: "random_with_recency", dataTid: "action_sort_user_arguments_is_reply", text: intl.formatMessage({id: "info.sort_by_random" }) },
												{ value: "-created_at", type: "sort", name: "recent", text: intl.formatMessage({id: "info.sort_by_newest" }) },
												{ value: "-total_upvotes", type: "sort", name: "upvotes", text: intl.formatMessage({id: "info.sort_by_most_supported" }) },
												{ value: "-controversy_score", type: "sort", name: "controversy", text: intl.formatMessage({id: "info.sort_by_most_controversial" }) }
											]}
											filters={{"status": "accepted", "consultation_id" : consultation.id, "is_consultation_expert": true, ...(activeTagId && {"tag_id": activeTagId}), ...(activeExpertId && {"user_id": activeExpertId})}}
											loadingComponent={<UserContentSkeleton />}
											resourcePropName="proposal"
											resource={'proposals'} 
											perPage={10} 
											searchBar={true}
										>
											<Proposal disabled={date > endDate} />
										</VotePaginatedList>
									</TabPanel>
								}
								<TabPanel selectedClassName={styles.tabPane}>
									<ConsultationSynthesis consultation={consultation} />
								</TabPanel>
							</Tabs>
						</div>
					</>
				)
			}
		</>
	)
}

export default withLoading(Consultation);