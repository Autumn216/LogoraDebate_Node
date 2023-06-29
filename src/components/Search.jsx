import React, { useState, useEffect } from 'react';
import qs from 'querystringify';
import { useConfig } from '@logora/debate.context.config_provider';
import { useIntl, FormattedMessage } from 'react-intl';
import { useLocation } from 'react-router';
import { Helmet } from "react-helmet";
import TagList from '@logora/debate.tag.tag_list';
import { PaginatedList } from "@logora/debate.list.paginated_list";
import { DebateBox } from '@logora/debate.debate.debate_box';
import { UserBox } from "@logora/debate.user.user_box";
import BoxSkeleton from '@logora/debate.skeleton.box_skeleton';
import UserContentSkeleton from '@logora/debate.skeleton.user_content_skeleton';
import cx from 'classnames';
import styles from './Search.module.scss';

const Search = props => {
    const intl = useIntl();
    const config = useConfig();
    const location = useLocation();
    const [activeTab, setActiveTab] = useState("1");
    const [query, setQuery] = useState(qs.parse(location.search).q || "");
    const [totalUsers, setTotalUsers] = useState(0);
    const [totalDebates, setTotalDebates] = useState(0);

    useEffect(() => {
        const values = qs.parse(location.search);
        const query = values.q;
        setQuery(query);
    }, [location.search])

    const toggle = (tab) => {
        if (activeTab !== tab) {
            setActiveTab(tab);
        }
    }

    const handleUpdateTotalDebates = (totalDebates) => {
        setTotalDebates(totalDebates);
    }

    const handleUpdateTotalUsers = (totalUsers) => {
        setTotalUsers(totalUsers);
    }

    return (
        <div id="search" className={styles.search} data-pid="search">
            { config.isDrawer !== true &&
                <Helmet>
                    <title>{query} - { intl.formatMessage({ id:"metadata.search_title" }) + " - " + config.provider.name }</title>
                    <link rel="canonical" href={typeof window !== 'undefined' ? window.location.href : ""} />
                </Helmet>
            }
            <>
                <TagList />
                <div className={styles.searchContainer}>
                    <nav className={styles.searchNav} role={"navigation"}>
                        <ul className={styles.navTabs}>
                            <li className={styles.navItem}>
                                <div
                                    className={cx(styles.navLink, { [styles.active]: activeTab === '1' })}
                                    onClick={() => { toggle('1'); }}
                                >
                                    <FormattedMessage id="info.debates" /> <span className={styles.tabNumber}>{totalDebates}</span>
                                </div>
                            </li>
                            <li className={styles.navItem}>
                                <div
                                    className={cx(styles.navLink, { [styles.active]: activeTab === '2' })}
                                    onClick={() => { toggle('2'); }}
                                >
                                    <FormattedMessage id="info.debaters" /> <span className={styles.tabNumber}>{totalUsers}</span>
                                </div>
                            </li>
                        </ul>
                        <div className={styles.tabContent}>
                            <div className={cx(styles.tabPane, { [styles.active]: activeTab === '1' })}>
                                <PaginatedList 
                                    currentListId={"searchGroupsList"}
                                    resource={'groups'} 
                                    query={query} 
                                    perPage={10} 
                                    loadingComponent={<BoxSkeleton />}
                                    resourcePropName="debate"
                                    onUpdateTotal={handleUpdateTotalDebates} 
                                    staticContext={props.staticContext} 
                                    staticResourceName={"getDebateResults"} 
                                >
                                    <DebateBox />
                                </PaginatedList>
                            </div>
                            <div className={cx(styles.tabPane, { [styles.active]: activeTab === '2' })}>
                                <PaginatedList 
                                    currentListId={"searchUsersList"}
                                    resource={'users'} 
                                    searchQuery={query} 
                                    perPage={10} 
                                    loadingComponent={<UserContentSkeleton hideBody />}
                                    resourcePropName="user"
                                    onUpdateTotal={handleUpdateTotalUsers} 
                                >
                                    <UserBox />
                                </PaginatedList>
                            </div>
                        </div>
                    </nav>
                </div>
            </>
        </div>
    );
}

export default Search;
