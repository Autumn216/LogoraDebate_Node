import React, { useState, useEffect } from 'react';
import { useRoutes } from '@logora/debate.context.config_provider';
import { useDataProvider } from '@logora/debate.data.data_provider';
import { useLocation, useHistory } from "react-router-dom";
import { Tag } from '@logora/debate.tag.tag';
import styles from './TagList.module.scss';

export const TagList = (props) => {
	const [tags, setTags] = useState(props.staticContext && props.staticContext.getApplicationTags);
	const routes = useRoutes();
	const dataProvider = useDataProvider();
	const { push } = useHistory();
	let location = useLocation();

	let searchQuery = null;
	if(typeof window !== 'undefined') {
		const urlParams = new URLSearchParams(location.search);
		searchQuery = urlParams.get('q');
	}

	useEffect(() => {
		loadTags();
	}, [])

	const loadTags = () => {
		const taggingCountComparison = (a, b) => {
			let comparison = 0;
			if (a.taggings_count > b.taggings_count) {
				comparison = 1;
			} else if (a.taggings_count < b.taggings_count) {
				comparison = -1;
			}
			return comparison;
		}

		dataProvider.getList("tags", { page: 1, per_page: 4, sort: "-created_at", countless: true }).then(response => {
			if(response.data.success) {
				const sortedTags = response.data.data.sort(taggingCountComparison);
				setTags(sortedTags.reverse().slice(0, 4));
			}
		}).catch(error => { });
	}

	const displayTag = (tag, index) => {
		return (
			<button
				type="button"
				role="link"
				className={styles.tagContainer} 
				data-tid={"action_search_tag"} 
				key={tag.id} 
				onClick={() => push({ pathname: routes.searchLocation.toUrl(), search: `?q=${tag.name}` })}>
				<Tag dataTid={"action_search_tag"} text={tag.display_name} active={searchQuery === tag.name} className={props.className} />
			</button>
		);
	}

	return (
		<>
			{ tags && (
				<div role="list" className={styles.indexTagList}>
					{ tags.map(displayTag) }
				</div>
			)}
		</>
	)
}
