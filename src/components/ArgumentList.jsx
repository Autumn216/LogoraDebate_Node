import React, { useState, useEffect } from "react";
import { useConfig } from '@logora/debate.context.config_provider';
import { withInput } from "../store/InputAndListProvider";
import { useAuth } from "@logora/debate.auth.use_auth";
import { useResponsive } from '@logora/debate.hooks.use_responsive';
import { useLocation } from "react-router-dom";
import { useIntl } from "react-intl";
import { useList } from '@logora/debate.list.list_provider';
import { Pagination } from '@logora/debate.list.pagination';
import Select from '@logora/debate.input.select';
import { setSessionStorageItem } from "../utils/SessionStorage";
import Argument from "./Argument";
import ArgumentBoxWithAd from "./ArgumentBoxWithAd";
import { ArgumentBlankBox } from '@logora/debate.argument.argument_blank_box';
import UserContentSkeleton from '@logora/debate.skeleton.user_content_skeleton';
import VotePaginatedList from './VotePaginatedList';
import styles from "./ArgumentList.module.scss";

const PER_PAGE = 4;
const PER_PAGE_MOBILE = 8;

const ArgumentList = (props) => {
	const intl = useIntl();
	const config = useConfig();
	const { currentUser } = useAuth();
	const list = useList();
	const [isLoadingMoreArguments, setIsLoadingMoreArguments] = useState(false);
	const [currentPage, setCurrentPage] = useState(1);
	const [currentSort, setCurrentSort] = useState("-score");
	const [totalArguments, setTotalArguments] = useState(0);
	const [currentFilter, setCurrentFilter] = useState({});
	const [extraArgumentId, setExtraArgumentId] = useState(undefined);
	const [extraArgumentsArray, setExtraArgumentsArray] = useState([]);
	const location = useLocation();
	const [isMobile, isTablet, isDesktop] = useResponsive();

	useEffect(() => {
		if (typeof window !== "undefined") {
			let pageAnchor = location.pathname + location.hash.slice(1);
			const result = pageAnchor.split("argument_");
			if (result.length > 1) {
				let argumentId = result[1];
				setExtraArgumentId(argumentId);
				setCurrentFilter({...currentFilter, argument_id: argumentId });
			}
		}
	}, [])

	useEffect(() => {
		if(props.userArguments.length > 0) {
			if(isMobile) {
				list.add("argumentListMobile", props.userArguments);
			} else {
				list.add(`argumentList${props.debatePositions[0].id}`, props.userArguments.filter(userArg => userArg.position.id === props.debatePositions[0].id));
				list.add(`argumentList${props.debatePositions[1].id}`, props.userArguments.filter(userArg => userArg.position.id === props.debatePositions[1].id));
			}
		}
	}, [props.userArguments])

	const setTotalElements = (total) => {
		if(total > totalArguments) {
			setTotalArguments(parseInt(total));
		}
	}

	const handleLoadMoreElements = () => {
		setCurrentPage(currentPage + 1);
	}

	const transformArguments = (argument, positionId) => {
		if (argument.is_reply === true) { return; }
		if (positionId && argument.is_reply === false && argument.position.id !== positionId) { return; }
		if (argument.status === "rejected" || argument.status === "pending") { 
			if (argument.author.id === currentUser.id) {
				return argument;
			} else {
				return;
			}
		}
		return argument;
	}

	const handleSelectChange = (selectValue) => {
		setCurrentPage(1);
		setTotalArguments(0);
		if (selectValue.type === "filter") {
			setCurrentSort("");
			setCurrentFilter({ [selectValue.name]: selectValue.value });
		} else if (selectValue.type === "position") {
			setCurrentSort("");
			setCurrentFilter({ position_id: selectValue.value })
		}	else {
			setCurrentSort(selectValue.value);
			setCurrentFilter({});
		}
	};

	const addOptionsToDropdownSelect = (positions, sortOptions) => {
		if (Object.keys(positions).length > 0) {
			const positionObject = positions.map((position) => ({
				name: position.name,
				value: position.id,
				type: "position",
				dataTid: "",
				text: position.name,
			}));
			return [...sortOptions, ...positionObject];
		} else {
			return [...sortOptions];
		}
	};

	const getSortOptions = () => {
		const options = [
			{
				name: "relevance",
				value: "-score",
				type: "sort",
				dataTid: "action_sort_arguments_relevant",
				text: intl.formatMessage({id: "info.sort_by_relevance" }),
			},
			{
				name: "recent",
				value: "-created_at",
				type: "sort",
				dataTid: "action_sort_arguments_recent",
				text: intl.formatMessage({id: "info.sort_by_newest" }),
			},
			{
				name: "old",
				value: "+created_at",
				type: "sort",
				dataTid: "action_sort_arguments_old",
				text: intl.formatMessage({id: "info.sort_by_oldest" }),
			},
		];
		if(config.modules.experts === true) {
			options.push({
				name: "is_expert",
				type: "filter",
				value: "true",
				dataTid: "action_sort_arguments_is_expert",
				text: intl.formatMessage({id: "alt.expert_user" }),
			});
		}
		return options;
	};

	const getRepliesThread = (newArguments) => {
		setIsLoadingMoreArguments(false);
		let currentExtraArgument = newArguments.filter((arg) => arg.id == extraArgumentId)[0] || null;
		if (currentExtraArgument) {
			let newArray = [...extraArgumentsArray, currentExtraArgument];
			while (currentExtraArgument.reply_to_id) {
				currentExtraArgument = newArguments.filter((arg) => arg.id == currentExtraArgument.reply_to_id)[0] || null;
				newArray.push(currentExtraArgument);
			}
			setExtraArgumentsArray(newArray);
		}
	};

	const handleStartInput = (positionIndex) => {
		setSessionStorageItem("userSide", JSON.stringify(
			{
				groupId: props.debate.id,
				positionId: props.debatePositions[positionIndex].id
			}));
		props.setStartInput(true);
	}

	return (
		<>
			<div className={styles.debateNavbar}>
				<Select
					onChange={handleSelectChange}
					options={addOptionsToDropdownSelect(isMobile ? props.debate.group_context.positions : {}, getSortOptions())}
				/>
			</div>
			{ isMobile ? (
				<>
					<VotePaginatedList 
						voteableType={"Message"}
						currentListId={`argumentListMobile`}
						display={"column"}
						onUpdateTotal={(total) => setTotalElements(total)}
						resourcePropName="argument"
						perPage={PER_PAGE_MOBILE}
						currentPage={currentPage}
						resource={`groups/${props.debateSlug}/messages`}
						withPagination={false}
						transformData={(argument) => transformArguments(argument, null)}
						staticContext={props.staticContext}
						staticResourceName={props.staticResourceName}				
						onElementsLoad={(newArguments) => getRepliesThread(newArguments)}
						sort={currentSort}
						filters={currentFilter}
						loadingComponent={<UserContentSkeleton />}
						emptyListComponent={
							<ArgumentBlankBox
								handleClick={() => props.setStartInput(true)}
							/>
						}
					>
						<ArgumentBoxWithAd 
							debatePositions={props.debatePositions}
							debateName={props.debateName}
							debateGroupContext={props.debateGroupContext}
							debateSlug={props.debateSlug}
							nestingLevel={props.enableReplies === false ? 4 : 0}
							expandable={props.expandable}
							debateIsActive={props.debateIsActive}
							displayAd={config.ads.display}
							replies={extraArgumentsArray.length > 0 && extraArgumentsArray}
						/>
					</VotePaginatedList>
					<Pagination
						currentPage={currentPage}
						perPage={PER_PAGE_MOBILE}
						totalElements={totalArguments}
						onLoadMoreElements={handleLoadMoreElements}
						isLoadingMoreElements={isLoadingMoreArguments}
						showMoreText={intl.formatMessage({id: "action.see_more" })}
					/>
				</>
			)
			:
			<>
				{props.debatePositions && props.debatePositions.length < 3 && (
					<>
						<div className={styles.argumentListContainer} data-vid={"view_argument_list_container"}>
							<ul className={styles.argumentList}>
								<VotePaginatedList 
									voteableType={"Message"}
									currentListId={`argumentList${props.debatePositions[0].id}`}
									display={"column"}
									onUpdateTotal={(total) => setTotalElements(total)}
									resourcePropName="argument"
									perPage={PER_PAGE}
									currentPage={currentPage}
									resource={`groups/${props.debateSlug}/messages`}
									withPagination={false}
									transformData={(argument) => transformArguments(argument, props.debatePositions[0].id)}
									staticContext={props.staticContext}
									staticResourceName={props.staticResourceName}
									onElementsLoad={(newArguments) => getRepliesThread(newArguments)}
									sort={currentSort}
									filters={{ position_id: props.debatePositions[0].id, ...currentFilter }}
									loadingComponent={<UserContentSkeleton />}
									emptyListComponent={
										<ArgumentBlankBox
											position={props.debatePositions[0]} 
											positionClassName={styles[`positionBackground-0`]}
											handleClick={() => handleStartInput(0)}
										/>
									}
								>
									<Argument 
										debatePositions={props.debatePositions}
										debateName={props.debateName}
										debateGroupContext={props.debateGroupContext}
										debateSlug={props.debateSlug}
										nestingLevel={props.enableReplies === false ? 4 : 0} 
										expandable={props.expandable} 
										debateIsActive={props.debateIsActive}
										replies={extraArgumentsArray.length > 0 && extraArgumentsArray}
									/>
								</VotePaginatedList>
							</ul>
							<ul className={styles.argumentList}>
								<VotePaginatedList 
									voteableType={"Message"}
									currentListId={`argumentList${props.debatePositions[1].id}`}
									display={"column"}
									onUpdateTotal={(total) => setTotalElements(total)}
									resourcePropName="argument"
									perPage={PER_PAGE}
									currentPage={currentPage}
									resource={`groups/${props.debateSlug}/messages`}
									withPagination={false}
									transformData={(argument) => transformArguments(argument, props.debatePositions[1].id)}
									staticContext={props.staticContext}
									staticResourceName={props.staticResourceName}
									onElementsLoad={(newArguments) => getRepliesThread(newArguments)}
									sort={currentSort}
									filters={{ position_id: props.debatePositions[1].id, ...currentFilter }}
									loadingComponent={<UserContentSkeleton />}
									emptyListComponent={
										<ArgumentBlankBox 
											position={props.debatePositions[1]} 
											positionClassName={styles[`positionBackground-1`]}
											handleClick={() => handleStartInput(1)}
										/>
									}
								>
									<Argument
										debatePositions={props.debatePositions} 
										debateName={props.debateName}
										debateGroupContext={props.debateGroupContext}
										debateSlug={props.debateSlug}
										nestingLevel={props.enableReplies === false ? 4 : 0}
										expandable={props.expandable}
										debateIsActive={props.debateIsActive}
										replies={extraArgumentsArray.length > 0 && extraArgumentsArray}
									/>
								</VotePaginatedList>
							</ul>
						</div>
						<Pagination
							data-tid={"action_view_more_arguments"}
							currentPage={currentPage}
							perPage={PER_PAGE}
							totalElements={totalArguments}
							onLoadMoreElements={handleLoadMoreElements}
							isLoadingMoreElements={isLoadingMoreArguments}
							hasLoadingComponent
							showMoreText={intl.formatMessage({ id: "action.see_more" })}
						/>
					</>
				)}
			</>
		}
		</>
	);
}

export default withInput(ArgumentList);