import React, { useState, useEffect } from 'react';
import { useDataProvider } from '@logora/debate.data.data_provider';
import { useIntl } from 'react-intl';
import BadgeBox from './BadgeBox';
import styles from './BadgeTab.module.scss';

const BadgeTab = (props) => {
    const [badges, setBadges] = useState([]);
    const [nextBadges, setNextBadges] = useState([]);
    const [completedBadges, setCompletedBadges] = useState([]);
    const [loadError, setLoadError] = useState(false);
    const api = useDataProvider();
    const intl = useIntl();

    useEffect(() => {
        loadUserBadges(props.userSlug);
    }, []);

    const loadUserBadges = (userSlug) => {
        const resource = "users/" + userSlug + "/badges";
        api.getList(resource, { page: 1, per_page: 100, sort: "-created_at", countless: true }).then(response => {
            if (response.data.success) {
                setBadges(response.data.data.badges);
                setNextBadges(response.data.data.next_badges);
                setCompletedBadges(response.data.data.completed_badges);
            } else {
                setLoadError(true)
            }
        }).catch(error => {
            setLoadError(true)
        })
    }

    const displayBadge = (badge, index) => {
        return (<BadgeBox key={index} badge={badge} user={props.user} />);
    }

    const getAllBadges = () => {
        badges.slice().forEach(function(e) { e.hasBadge = true });
        nextBadges.slice().forEach(function(e) { e.hasBadge = false });
        nextBadges.sort((a, b) => {
            const percentageA = a.progress * 100 / a.badge.steps;
            const percentageB = b.progress * 100 / b.badge.steps;
            if(percentageA > percentageB) {
               return -1;
            } else if(percentageA < percentageB) {
               return 1;
            } else {
               return percentageB-percentageA;
            }
        });
        if (completedBadges.length > 0) {
            if (nextBadges.length > 0) {
                return nextBadges.concat(completedBadges);
            } else {
                return completedBadges;
            }
        } else {
            return nextBadges;
        }
    }

    const allBadges = getAllBadges();

    return (
        loadError ? 
            <div className={styles.error}>{ intl.formatMessage({ id: 'error.badges' }) }</div>
        :
            <>
                <div className={styles.badgesBox}>
                    <div className={styles.badgeBoxHeader}>{ intl.formatMessage({ id: 'header.badges_box_title' }) }</div>
                    <div className={styles.badgesBoxContent}>
                        {allBadges.length === 0 ? (
                            <div className={styles.emptyBadges}>{ intl.formatMessage({ id: 'fallback.no_badges' }) }</div>
                        ) : (
                            allBadges.map(displayBadge)
                        )}
                    </div>
                </div>
            </>
    );
}

export default BadgeTab;