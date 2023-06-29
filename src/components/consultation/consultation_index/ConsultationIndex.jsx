import React, { useState } from 'react';
import { PaginatedList } from '@logora/debate.list.paginated_list';
import { FormattedMessage } from 'react-intl';
import { ConsultationBox } from '@logora/debate.consultation.consultation_box';
import UserContentSkeleton from '@logora/debate.skeleton.user_content_skeleton';
import cx from 'classnames';
import styles from './ConsultationIndex.module.scss';

export const ConsultationIndex = (props) => {
    const [activeTab, setActiveTab] = useState(0);

    const toggleTab = (tab) => {
		if (activeTab !== tab) {
			setActiveTab(tab);
		}
	}

    return (
        <>
            <nav className={styles.navigation} role={"navigation"}>
                <ul className={styles.navTabs}>
                    <li className={styles.navItem}>
                        <div
                            className={cx(styles.navLink, { [styles.active]: activeTab === 0 })}
                            onClick={() => { toggleTab(0); }}
                        >
                            <FormattedMessage id="consultation.consultation_index.sort_by_all" defaultMessage={"All"} />
                        </div>
                    </li>
                    <li className={styles.navItem}>
                        <div
                            className={cx(styles.navLink, { [styles.active]: activeTab ===  1})}
                            onClick={() => { toggleTab(1); }}
                        >
                            <FormattedMessage id="consultation.consultation_index.sort_by_in_progress" defaultMessage={"In progress"} />
                        </div>
                    </li>
                    <li className={styles.navItem}>
                        <div
                            className={cx(styles.navLink, { [styles.active]: activeTab === 2 })}
                            onClick={() => { toggleTab(2); }}
                        >
                            <FormattedMessage id="consultation.consultation_index.sort_by_archived" defaultMessage={"Archived"} />
                        </div>
                    </li>
                </ul>
            </nav>
            <div className={styles.tabContent}>
                <div className={cx(styles.tabPane, { [styles.active]: activeTab === 0 })}>
                    { activeTab === 0 && (
                        <PaginatedList 
                            currentListId={"consultationsList"}
                            sortOptions={false}
                            sort={"-created_at"}
                            loadingComponent={<UserContentSkeleton />}
                            resource={'consultations'} 
                            resourcePropName="consultation"
                            staticContext={props.staticContext}
                            staticResourceName={"getConsultations"}
                            perPage={10}
                            searchBar={false}
                        >
                            <ConsultationBox />
                        </PaginatedList>
                    )}
                </div>
                <div className={cx(styles.tabPane, { [styles.active]: activeTab === 1 })}>
                    { activeTab === 1 && (
                        <PaginatedList 
                            currentListId={"consultationsList"}
                            sortOptions={false}
                            sort={"-created_at"}
                            filters={ { "expired": false } }
                            loadingComponent={<UserContentSkeleton />}
                            resource={'consultations'} 
                            resourcePropName="consultation"
                            perPage={10}
                            searchBar={false}
                        >
                            <ConsultationBox />
                        </PaginatedList>
                    )}
                </div>
                <div className={cx(styles.tabPane, { [styles.active]: activeTab === 2 })}>
                        { activeTab === 2 && (
                            <PaginatedList 
                                currentListId={"consultationsList"}
                                filters={ { "expired": true } }
                                sort={"-created_at"}
                                sortOptions={false}
                                loadingComponent={<UserContentSkeleton />}
                                resource={'consultations'} 
                                resourcePropName="consultation"
                                perPage={10}
                                searchBar={false}
                            >
                                <ConsultationBox />
                            </PaginatedList>
                    )}
                </div>
            </div>
        </>
    );
};
