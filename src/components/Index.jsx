import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { useConfig } from '@logora/debate.context.config_provider';
import { useDataProvider } from '@logora/debate.data.data_provider';
import { useResponsive } from "@logora/debate.hooks.use_responsive";
import { useIntl, FormattedMessage } from "react-intl";
import { DebateBox } from '@logora/debate.debate.debate_box';
import { UserBox } from "@logora/debate.user.user_box";
import TagList from '@logora/debate.tag.tag_list';
import { LinkButton } from '@logora/debate.action.link_button';
import { PaginatedList } from "@logora/debate.list.paginated_list";
import UserContentSkeleton from '@logora/debate.skeleton.user_content_skeleton';
import BoxSkeleton from '@logora/debate.skeleton.box_skeleton';
import cx from "classnames";
import styles from "./Index.module.scss";

const Index = (props) => {
	const intl = useIntl();
	const api = useDataProvider();
	const [loading, setLoading] = useState(props.staticContext ? false : true);
	const [loadError, setLoadError] = useState(false);
	const [mainDebate, setMainDebate] = useState(props.staticContext && props.staticContext.mainDebate || undefined);
	const [noDebate, setNoDebate] = useState(false);
	const config = useConfig();
	const [isMobile, isTablet, isDesktop] = useResponsive();

	useEffect(() => {
		setLoading(true);
		loadTrendingDebate();
	}, [])

	const loadTrendingDebate = () => {
		api.getList("groups", { page: 1, per_page: 1, sort: "-created_at", ...(config.modules.subApplications && { "by_sub_application": config.id }), countless: true})
			.then((response) => {
				if (response.data.success) {
					const newElements = response.data.data;
					setLoading(false);
					if (newElements.length > 0) {
						setMainDebate(newElements[0])
					} else {
						setNoDebate(true);
					}
				} else {
					setLoadError(true);
				}
			})
			.catch((error) => {
				setLoadError(true);
			});
	};


	if (loadError) {
		throw new Error(intl.formatMessage({ id: "error.index" }));
	}
	return (
		<>
			<div id='index' className={styles.index} data-pid='index'>
				{config.isDrawer !== true &&
					<Helmet>
						<title>{ intl.formatMessage({ id: "metadata.index_title" }) + " - " + config.provider.name }</title>
						<meta name="description" content={intl.formatMessage({ id: "metadata.index_description" }) } />
						<meta property="og:title" content={ intl.formatMessage({ id: "metadata.index_title" }) + " - " + config.provider.name } />
						<meta property="og:description" content={intl.formatMessage({ id: "metadata.index_description" }) } />
						<meta property="og:type" content="website" />
						<meta property="og:site_name" content={config.provider.name} />
						{ (typeof window !== "undefined") &&
							<meta property="og:url" content={window.location.href.split(/[?#]/)[0]} />
						}
						{ (typeof window !== "undefined") &&
							<link rel='canonical' href={window.location.href.split(/[?#]/)[0]} />
						}
					</Helmet>
				}
				<>
					{ !loading && mainDebate === undefined &&
						<div className={styles.noDebatesError}>
							<FormattedMessage id='fallback.index' />
							<LinkButton
								className={styles.indexAdminButton}
								to={{pathname: 'http://admin.logora.fr'}}
								target={"_blank"}
							>
								{ intl.formatMessage({ id:"fallback.admin_panel" }) }
							</LinkButton>
						</div>
					}
					{ !noDebate &&
						<>
							<TagList staticContext={props.staticContext} />
							<div className={styles.indexHeader}>
								<div className={cx(styles.indexHeaderBody, {[styles.indexHeaderBodyisTablet]: !isMobile})}>
									<div className={styles.indexBoxHeader}>
										{ intl.formatMessage({ id: "header.main_debate" }) }
									</div>
									{loading || mainDebate === undefined ? 
											<BoxSkeleton boxHeight={!isMobile ? 330 : 200}/>
										:
											<DebateBox
												debate={mainDebate}
												mainDebate={isTablet}
											/>
									}
								</div>
								{!isMobile && (
									<div className={styles.indexBestUsersDesktop}>
										<div className={styles.indexBoxHeader}>
											<FormattedMessage id='header.best_users' />
										</div>
										<div className={styles.indexBestUsersBox}>
											<PaginatedList
												currentListId={"bestUsersList"}
												resource={"users/index/trending"}
												loadingComponent={<UserContentSkeleton hideBody />}
												resourcePropName="user"
												countless={true}
												display={"column"}
												perPage={4}
												withPagination={false}
												staticContext={props.staticContext}
												staticResourceName={"getBestUsers"}
											>
												<UserBox />
											</PaginatedList>
										</div>
									</div>
								)}
							</div>
							<div className={styles.indexDebateBox}>
								{ mainDebate !== undefined &&
									<PaginatedList 
										currentListId={"debateList"}
										sortOptions={
											[
												{
													name: "trending",
													value: "true",
													type: "filter",
													dataTid: "action_sort_debates_trending",
													text: intl.formatMessage({id: "info.sort_by_trending_debate" }),
												},
												{
													name: "recent",
													value: "-created_at",
													dataTid: "action_sort_debates_recent",
													text: intl.formatMessage({id: "info.sort_by_newest_debate" }),
												},
												{
													name: "old",
													value: "+created_at",
													dataTid: "action_sort_debates_old",
													text: intl.formatMessage({id: "info.sort_by_oldest_debate" }),
												}
											]
										}
										filters={{ ...(config.modules.subApplications && {"by_sub_application": config.id}) }}
										loadingComponent={<BoxSkeleton />}
										resourcePropName="debate"
										perPage={6}
										resource={'groups'}
										searchBar={true}
										transformData={elm => elm.id != mainDebate.id}
										staticContext={props.staticContext}
										staticResourceName={"getTrendingDebates"} 
									>
										<DebateBox />
									</PaginatedList>
								}
							</div>
							{isMobile && (
								<div className={cx(styles.indexBestUsersMobile, {[styles.indexBestUsersisTablet]: !isMobile})}>
									<div className={styles.indexBoxHeader}>
										<FormattedMessage id='header.best_users' />
									</div>
									<div className={styles.indexBestUsersBox}>
										<PaginatedList
											currentListId={"bestUsersList"}
											resource={"users/index/trending"}
											loadingComponent={<UserContentSkeleton hideBody />}
											resourcePropName="user"
											countless={true}
											display={"column"}
											perPage={4}
											withPagination={false}
											staticContext={props.staticContext}
											staticResourceName={"getBestUsers"}
										>
											<UserBox />
										</PaginatedList>
									</div>
								</div>
							)}
						</>
					}
				</>
			</div>
		</>
	);
}

export default Index;
