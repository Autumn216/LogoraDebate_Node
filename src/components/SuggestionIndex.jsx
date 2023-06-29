import React, { useState, useEffect, useMemo } from 'react';
import { useConfig } from '@logora/debate.context.config_provider';
import { useDataProvider } from '@logora/debate.data.data_provider';
import { useAuth } from "@logora/debate.auth.use_auth";
import { withInput } from "../store/InputAndListProvider";
import { useIntl } from "react-intl";
import { uniqueBy } from '@logora/debate.util.unique_by';
import { useList } from '@logora/debate.list.list_provider';
import VotePaginatedList from './VotePaginatedList';
import SuggestionInput from './SuggestionInput';
import SuggestionListBanner from './SuggestionListBanner';
import UserContentSkeleton from '@logora/debate.skeleton.user_content_skeleton';
import SuggestionBox from './SuggestionBox';
import styles from './SuggestionIndex.module.scss';
import cx from 'classnames';

const SuggestionIndex = (props) => {
	const intl = useIntl();
	const config = useConfig();
	const api = useDataProvider();
	const list = useList();
	const seed = useMemo(() => Math.random(), []);
	const { isLoggedIn, currentUser } = useAuth();
    const [activeTab, setActiveTab] = useState(0);
	const [userSuggestionsCount, setUserSuggestionsCount] = useState(0);
	const [userSuggestions, setUserSuggestions] = useState([]);
	

	useEffect(() => {
		if (isLoggedIn) {
			getUserSuggestions();
		}
	}, [isLoggedIn]);

    const toggleTab = (tab) => {
		if (activeTab !== tab) {
			setActiveTab(tab);
		}
	}

	const getUserSuggestions = () => {
		api.getList('debate_suggestions', { page: 1, per_page: 5, sort: "-created_at", user_id: currentUser.id, is_expired: false, is_accepted: false }).then(response => {
			if (response.data.success) {
				const headers = response.headers;
				if ("total" in headers) {
					setUserSuggestionsCount(headers.total);
				}
				if (response.data.data.length > 0) {
					const newSuggestions = uniqueBy([...userSuggestions, ...response.data.data], "id");
					setUserSuggestions(newSuggestions);
					list.add("suggestionsList", newSuggestions);
				}
			}
		})
	}

    return (
		<>	
			<div className={styles.container}>
				<div className={styles.header}>
					<div className={styles.title}>{ intl.formatMessage({ id: "suggestion.title" })}</div>
					<div className={styles.description}>{ intl.formatMessage({ id: "suggestion.description" }, { vote_goal: (config.modules.suggestions && config.modules.suggestions.vote_goal || 30) }) }</div>
					<div className={styles.input}>
						<SuggestionInput 
							disabled={ isLoggedIn && currentUser.points < 100 ? true : false } 
							userSuggestionsCount={ userSuggestionsCount || 0 } 
							checkUserSuggestionsCount={ () => getUserSuggestions() }
						/>
					</div>
				</div>
				
				<nav className={styles.navigation} role={"navigation"}>
					<ul className={styles.navTabs}>
						<li className={styles.navItem}>
							<div
								className={cx(styles.navLink, { [styles.active]: activeTab === 0 })}
								onClick={() => { toggleTab(0); }}
							>
								{ intl.formatMessage({ id: "info.inprogress" }) }
							</div>
						</li>
						<li className={styles.navItem}>
							<div
								className={cx(styles.navLink, { [styles.active]: activeTab === 1 })}
								onClick={() => { toggleTab(1); }}
							>
								{ intl.formatMessage({ id: "suggestion.tabs_selected" })}
							</div>
						</li>
					</ul>
				</nav>
				<div className={styles.tabContent}>
					<div className={cx(styles.tabPane, { [styles.active]: activeTab === 0 })}>
						{ activeTab === 0 && (
							<VotePaginatedList 
								voteableType={"DebateSuggestion"}
								currentListId={"suggestionsList"}
								sortOptions={[
									{ value: seed, type: "filter", name: "random", text: intl.formatMessage({id: "info.sort_by_random" }) },
									{ value: "-created_at", type: "sort", name: "recent", text: intl.formatMessage({id: "info.sort_by_newest" }) },
									{ value: "+created_at", type: "sort", name: "old", text: intl.formatMessage({id: "info.sort_by_oldest" }) },
									{ value: "-upvotes", type: "sort", name: "most_supported", text: intl.formatMessage({id: "info.sort_by_most_supported" }) },
								]}
								resourcePropName="suggestion"
								resource={'debate_suggestions'} 
								filters={ { "status": "accepted", "is_expired": false, "is_accepted": false, "is_admin": false } }
								perPage={10} 
								searchBar={true}
								loadingComponent={<UserContentSkeleton />}
								emptyListComponent={<SuggestionListBanner onClick={() => props.setStartInput(true)} disabled={ isLoggedIn && currentUser.points < 100 ? true : false } />}
							>
								<SuggestionBox />
							</VotePaginatedList>
						)}
					</div>

					<div className={cx(styles.tabPane, { [styles.active]: activeTab === 1 })}>
						{ activeTab === 1 && (
							<VotePaginatedList 
								voteableType={"DebateSuggestion"}
								currentListId={"selectedSuggestionsList"}
								sortOptions={[
									{ value: "-created_at", type: "sort", name: "recent", text: intl.formatMessage({id: "info.sort_by_newest" }) },
									{ value: "+created_at", type: "sort", name: "old", text: intl.formatMessage({id: "info.sort_by_oldest" }) },
								]}
								resourcePropName="suggestion"
								resource={'debate_suggestions'} 
								filters={ { "status": "accepted", "is_accepted": true, "is_admin": false } }
								perPage={10}
								searchBar={true}
								loadingComponent={<UserContentSkeleton />}
								emptyListComponent={ intl.formatMessage({ id: "info.empty.selected_suggestion" }, { vote_goal: (config.modules.suggestions && config.modules.suggestions.vote_goal || 30) }) }
							>
								<SuggestionBox />
							</VotePaginatedList>
						)}
					</div>
				</div>
			</div>
		</>
    )
}

export default withInput(SuggestionIndex);
