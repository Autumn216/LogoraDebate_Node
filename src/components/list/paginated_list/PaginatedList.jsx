import React, { useState, useEffect } from "react";
import { useDataProvider } from '@logora/debate.data.data_provider';
import { useResponsive } from "@logora/debate.hooks.use_responsive";
import { useIntl } from "react-intl";
import { useList } from "@logora/debate.list.list_provider";
import { Pagination } from '@logora/debate.list.pagination';
import Select from '@logora/debate.input.select';
import { uniqueBy } from '@logora/debate.util.unique_by';
import SearchInput from "@logora/debate.input.search_input";
import StandardErrorBoundary from '@logora/debate.error.standard_error_boundary';
import usePrevious from "@rooks/use-previous";
import cx from "classnames";
import styles from "./PaginatedList.module.scss";

export const PaginatedList = (props) => {
	const intl = useIntl();
	const list = useList();
	const api = useDataProvider();
	const [isMobile, isTablet, isDesktop] = useResponsive();
	const [isLoading, setIsLoading] = useState(false);
	const [loadError, setLoadError] = useState(false);
	const [isLoadingElements, setIsLoadingElements] = useState(false);
	const [resources, setResources] = useState(props.staticContext && props.staticResourceName && props.staticResourceName in props.staticContext ? props.staticContext[props.staticResourceName] : (props.resources || []));
	const [totalElements, setTotalElements] = useState(props.staticContext && props.staticResourceName && props.staticResourceName in props.staticContext ? props.staticContext[props.staticResourceName].length : 0);
	const [currentPage, setCurrentPage] = useState(1);
	const [extraElement, setExtraElement] = useState(props.extraElement || null);
	const [query, setQuery] = useState(props.query || null);

	const getInitSort = () => {
		return (props.sortOptions && props.sortOptions[0].type === "sort" && props.sortOptions[0].value) || props.sort || "";
	}

	const getInitFilters = () => {
		let initFilters = {};
		if (props.sortOptions && props.sortOptions[0].type === "filter") {
			initFilters[props.sortOptions[0].name] = props.sortOptions[0].value;
		}
		if (props.filters) {
			initFilters = Object.assign({}, initFilters, props.filters);
		}
		return initFilters;
	}

	const [currentSort, setCurrentSort] = useState(getInitSort());
	const [currentFilters, setCurrentFilters] = useState(getInitFilters());
	const previousFilters = usePrevious(props.filters);

	if (props.currentPage && (props.currentPage !== currentPage)) {
		setCurrentPage(props.currentPage);
	}

	if(props.query !== undefined && (props.query !== query)) {
		setQuery(props.query);
	}

	if(props.sort !== undefined && (props.sort !== currentSort)) {
		setCurrentSort(props.sort);
	}

	if(previousFilters && (JSON.stringify(props.filters) !== JSON.stringify(previousFilters)) && (JSON.stringify(props.filters) !== JSON.stringify(currentFilters))) {
		setCurrentFilters(props.filters);
	}

	useEffect(() => {
		if (props.resource) { 
			setCurrentPage(1);
			setIsLoading(true);
			loadResources();
		} else { 
			setIsLoading(false); 
		}
	}, [currentSort, currentFilters, query, props.resource]);

	useEffect(() => {
		if (currentPage > 1) {
			setIsLoadingElements(true);
			loadResources();
		}
	}, [currentPage]);

	useEffect(() => {
		if (list.addElements && (props.currentListId in list.addElements)) {
			if (list.addElements[props.currentListId].length > 0) {
				handleAddElements(list.addElements[props.currentListId]);
				let addElements = list.addElements;
				delete addElements[props.currentListId];
				list.setAddElements(addElements);
			}
		}
	}, [list.addElements]);

	useEffect(() => {
		if (list.updateElements && (props.currentListId in list.updateElements)) {
			if (list.updateElements[props.currentListId].length > 0) {
				handleEditElements(list.updateElements[props.currentListId]);
				let updateElements = list.updateElements;
				delete updateElements[props.currentListId];
				list.setUpdateElements(updateElements);
			}
		}
	}, [list.updateElements]);

	useEffect(() => {
		if (list.removeElements && (props.currentListId in list.removeElements)) {
			if (list.removeElements[props.currentListId].length > 0) {
				handleRemoveElements(list.removeElements[props.currentListId]);
				let removeElements = list.removeElements;
				delete removeElements[props.currentListId];
				list.setRemoveElements(removeElements);
			}
		}
	}, [list.removeElements]);

	const handleSortChange = (selectOption) => {
		if (selectOption.type === "filter") {
			setCurrentSort("");
			setCurrentFilters({
				...props.filters,
				[selectOption.name]: selectOption.value,
			});
		} else {
			// If props.filters is present, we want it to be persistent with the sort option
			setCurrentSort(selectOption.value);
			setCurrentFilters(props.filters ? {...props.filters} : {});
		}
	};
  
	const loadResources = () => {
		const loadFunction = props.withToken ? api.getListWithToken : api.getList;
		if (currentPage > 1 && currentFilters && currentFilters.argument_id) { delete currentFilters.argument_id } // remove extra Argument on load more
		if (((currentPage - 1) * props.perPage < totalElements) || currentPage === 1) {
			const params = {
				[props.pageParam || "page"]: currentPage,
				[props.perPageParam || "per_page"]: props.perPage,
				...(currentSort && { [props.sortParam || "sort"]: currentSort }),
				...(query && { [props.queryParam || "query"]: query }),
				...(props.countless === true && { countless: true }),
				...currentFilters
			}
			loadFunction(props.resource, params)
			.then((response) => {
				const headers = response.headers;
				if (headers) {
					if (props.totalHeaderParam || "total" in headers) {
						setTotalElements(parseInt(headers[props.totalHeaderParam || "total"], 10));
						if (props.onUpdateTotal) {
							props.onUpdateTotal(headers[props.totalHeaderParam || "total"]);
						}
					}
				}
				let newElements = response.data.data;
				if (props.onElementsLoad) {
					props.onElementsLoad(newElements);
				}
				if (props.transformData) {
					newElements = newElements.filter(props.transformData);
				}
				if (extraElement) {
					newElements = newElements.filter(elm => elm.id != extraElement.id);
					newElements.splice(0, 0, extraElement);
					setExtraElement(null);
				}
				if (list.addElements && (props.currentListId in list.addElements) && list.addElements[props.currentListId].length > 0) {
					newElements = [...list.addElements[props.currentListId], newElements];
				}
				if (currentPage > 1) {
					addElements(newElements);
				} else {
					updateElements(newElements);
				}
				setIsLoadingElements(false);
			})
			.catch((error) => {
				setLoadError(true);
				setIsLoading(false);
			});
		} else {
			setIsLoadingElements(false);
		}
	};

	const handleAddElements = (elements) => {
		setResources(prevElements => uniqueBy([...elements, ...prevElements], props.uniqueIdKey || "id"));
		props.onElementsLoad(elements);
	};

	const handleEditElements = (elements) => {
		let newElements = resources;
		elements.forEach(element => 
		 	newElements = newElements.map((a) => (a.id === element.id ? element : a))
		)
		updateElements(newElements);
	};

	const handleRemoveElements = (elements) => {
		let removedElementsIds = elements.map(elm => elm.id);
		const newElements = resources.filter(elm => removedElementsIds.indexOf(elm.id) === -1);
		updateElements(newElements);
	};

	const updateElements = (newElements) => {
		setResources(uniqueBy(newElements, props.uniqueIdKey || "id"));
		setIsLoading(false);
	};

	const addElements = (newElements) => {
		setResources(prevElements => uniqueBy([...prevElements, ...newElements], props.uniqueIdKey || "id"));
		setIsLoading(false);
	};

	const displayResource = (resource, index) => {
		if (resource != undefined) {
			return (
				<div className={styles.paginatedListItem} key={resource[props.uniqueIdKey || "id"]} onClick={props.onElementClick}>
					<StandardErrorBoundary hideMessage={true}>
						{ React.cloneElement(props.children, {...{ index: index, [props.resourcePropName]: resource }}) }
					</StandardErrorBoundary>
				</div>
			);
		} else { return null; }
	};

	const displayLoadingComponent = (index) => {
		if (props.loadingComponent) {
			return (
				<div className={styles.paginatedListItem} key={index}>
					{props.loadingComponent}
				</div>
			);
		} else { return null; }
	}

	if (loadError) {
		throw new Error(intl.formatMessage({ id: "error.list", defaultMessage: "Erreur lors du chargement des éléments." }));
	}
	
	return (
		<>
			{ (props.sortOptions || props.searchBar) && (
				<>
					<div className={styles.listHeader}>
						{props.sortOptions ? (
							<div className={cx(styles.filterContainer, styles.aboveSearch)}>
								<Select onChange={handleSortChange} options={props.sortOptions} />
							</div>
						) : null}
						{props.searchBar ? (
							<div className={styles.filterContainer}>
								<SearchInput 
									onSearchSubmit={(query) => setQuery(query)} 
									placeholder={intl.formatMessage({ id: "info.search_mobile", defaultMessage: "Search" })}
								/>
							</div>
						) : null}
					</div>
				</>
				)
			}
			{ !isLoading && resources.length === 0 && (
				props.emptyListComponent ? 
					<div className={styles.emptyListElement}>
						{props.emptyListComponent}
					</div>
				:
					<div className={styles.emptyList}>
						{ props.emptyText ? props.emptyText : intl.formatMessage({ id: "info.emptyList", defaultMessage: "No items for now." }) }
					</div>
			)}
			<>
				<div className={cx(styles.paginatedList, { [styles.paginatedListIsTablet]: !isMobile && !isDesktop, [styles.centeredList]: props.display === "column", [styles.column]: props.display === "column", [styles.twoElementsPerLine]: props.elementsPerLine === 2, [styles.oneElementPerLine]: props.elementsPerLine === 1 })} style={{gap: props.gap}}>
					{/* Show loading components or content depending of loading status */}
					{isLoading ? Array(props.perPage).fill().map((v, i) => i).map(displayLoadingComponent) : resources.map(displayResource)}
					{/* Show loading components directly in list when loading more elements */}
					{isLoadingElements && Array(props.perPage).fill().map((v, i) => i).map(displayLoadingComponent)}
				</div>
				{/* Show pagination button when content is loaded */}
				{ (!isLoading && props.withPagination !== false) && (
						<Pagination
							currentPage={currentPage}
							perPage={props.perPage}
							totalElements={props.numberElements || totalElements}
							onLoadMoreElements={() => setCurrentPage(currentPage + 1)}
							isLoadingMoreElements={isLoadingElements}
							hasLoadingComponent={true} // Disable loader when there is loading components to display instead
							showMoreText={intl.formatMessage({ id: "action.see_more", defaultMessage: "See more" })}
						/>
					)
				}
			</>
		</>
	);
}

PaginatedList.defaultProps = {
	gap: "10px"
};