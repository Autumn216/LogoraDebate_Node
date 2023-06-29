import React, { useState, useEffect } from "react";
import { useAuth } from "@logora/debate.auth.use_auth";
import { useConfig } from "@logora/debate.context.config_provider";
import { useResponsive } from "@logora/debate.hooks.use_responsive";
import { useDataProvider } from '@logora/debate.data.data_provider';
import { uniqueBy } from '@logora/debate.util.unique_by';
import { FormattedMessage } from 'react-intl';
import { DialogBox } from "@logora/debate.dialog.dialog_box";
import { Tabs, TabList, Tab, TabPanel } from 'react-tabs';
import DebateSummary from './DebateSummary';
import loadable from "@loadable/component";
import ArgumentList from "../ArgumentList";
import cx from "classnames";
import styles from "./DebateBody.module.scss";
const ArgumentInput = loadable(() => import("../ArgumentInput"));

const DebateBody = (props) => {
	const { isLoggedIn, currentUser } = useAuth();
	const config = useConfig();
	const api = useDataProvider();
	const [userArguments, setUserArguments] = useState([]);
	const [disabledPositions, setDisabledPositions] = useState([]);
	const [isMobile, isTablet, isDesktop] = useResponsive();

	useEffect(() => {
		if (isLoggedIn) { getUserArguments(); }
	}, [isLoggedIn]);

	useEffect(() => {
		checkDisabledPositions();
	}, [userArguments]);

	const getUserArguments = () => {
		props.debate.group_context.positions.slice(0, 2).map(position =>
			api.getList(`groups/${props.debate.slug}/messages`, { page: 1, per_page: 5, sort: "-created_at", user_id: currentUser.id ,is_reply: false, position_id: position.id }).then(response => {
				if (response.data.success && response.data.data.length > 0) {
					const newArguments = uniqueBy([...userArguments, ...response.data.data], "id");
					setUserArguments(newArguments);
				}
			})
		);
	}
	
	const checkDisabledPositions = () => {
		props.debate.group_context.positions.map(position => {
			if (userArguments.length > 0 && userArguments.filter(a => a.position.id === position.id).length >= 5) {
				if(!disabledPositions.includes(position)) { setDisabledPositions([...disabledPositions, position]); }
			}
		});
	}

	const displayPositionHeader = (position, index) => {
		return (
			<div className={cx(styles[`debateArgumentList-${index}`], styles.debateArgumentListPositionHeader)} key={index}>
				{position.name}
			</div>
		);
	};

	const displayArgumentList = () => {
		return (
			<div className={styles.debateArgumentListContainer}>
				{ !isMobile? (
					<div className={styles.debateArgumentListHeader}>
						{props.debate.group_context.positions.slice(0, 2).map(displayPositionHeader)}
					</div>
				) : null}
				<div className={styles.debateArgumentListBody}>
					<ArgumentList
						debate={props.debate}
						debateIsActive={props.debate.is_active}
						debateSlug={props.debate.slug}
						debatePositions={props.debate.group_context.positions.slice(0, 2)}
						debateName={props.debate.name}
						debateGroupContext={props.debate.group_context}
						staticContext={props.staticContext}
						staticResourceName={"getDebateArguments"}
						userArguments={userArguments}
					/>
				</div>
			</div>
		);
	}
	return (
		<>
			<div>
				<DialogBox 
					isTop
					isPoints 
					titleKey={"info.debates"} 
					contentKey={"info.debate.first_time"}
					isHidden={(isLoggedIn && currentUser.messages_count === 0) ? false : true}
				>
					<ArgumentInput
						onAddArgument={(argumentContent, position) => getUserArguments()}
						debateSlug={props.debate.slug}
						debateId={props.debate.id}
						debateName={props.debate.group_context.name}
						debatePositions={props.debate.group_context.positions}
						isMobileInput={isMobile}
						showAlert={true}
						disabled={props.debate.is_active === false}
						disabledPositions={disabledPositions}
					/>
				</DialogBox>
			</div>
			<div className={styles.debateBody}>
				{ config.modules.debate_summary === true ?
					<div className={styles.debateTabs}>
						<Tabs defaultIndex={0}>
							<TabList className={styles.navTabs}>
								<Tab className={cx(styles.navItem, styles.navLink)} selectedClassName={styles.active}>
									<FormattedMessage id='debate.debate_body.arguments_tab' />
								</Tab>
								<Tab className={cx(styles.navItem, styles.navLink)} selectedClassName={styles.active}>
									<FormattedMessage id='debate.debate_body.summary_tab' />
								</Tab>
							</TabList>
							<TabPanel selectedClassName={styles.tabPane}>
								{ displayArgumentList() }
							</TabPanel>
							<TabPanel selectedClassName={styles.tabPane}>
								<DebateSummary debate={props.debate} />
							</TabPanel>
						</Tabs>
					</div>
					:
					displayArgumentList()
				}
			</div>
		</>
	);
}

export default DebateBody;
