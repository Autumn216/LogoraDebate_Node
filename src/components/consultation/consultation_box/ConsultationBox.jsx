import React, { useMemo } from 'react';
import styles from './ConsultationBox.module.scss';
import { FormattedMessage } from 'react-intl';
import { useRelativeTime } from '@logora/debate.hooks.use_relative_time';
import { ArrowIcon, UserIcon, ChatIcon } from "@logora/debate.icons";
import { Link } from 'react-router-dom';
import ProgressBar from "@logora/debate.tools.progress_bar";
import cx from 'classnames';
import { useResponsive } from "@logora/debate.hooks.use_responsive";
import { useRoutes, useConfig } from '@logora/debate.context.config_provider';

export const ConsultationBox = (props) => {
    const consultation = props.consultation;
    const date = useMemo(() => new Date());
    const endDate = new Date(consultation.ends_at);
    const remainingTime = useRelativeTime(endDate.getTime());
    const routes = useRoutes();
    const [isMobile, isDesktop, isTablet] = useResponsive();
    const config = useConfig();

    const displayRemainingTime = () => {
        if( endDate < date ) {
            return <span><FormattedMessage id="consultation.consultation_box.consultation_ended" defaultMessage={"Consultation ended"}/></span>;
        } else {
            return <>
                <span><FormattedMessage id="consultation.consultation_box.in_progress" defaultMessage={"Consultation in progress"}/> - </span>
                <span>{ remainingTime }</span>
            </>;
        }
    }

    return (
        <>
            <div className={styles.container}>
                <Link to={routes.consultationShowLocation.toUrl({ consultationSlug: consultation.slug })}>
                    <img loading={"lazy"} className={cx(styles.consultationImage, {[styles.consultationImageIsMobile]: isMobile})} src={consultation.image_url} />
                </Link>
                <div className={cx(styles.consultationTime, {[styles.ended]: endDate < date})}>
                    {displayRemainingTime()}
                </div>
                <Link to={routes.consultationShowLocation.toUrl({ consultationSlug: consultation.slug })}>
                    <div className={styles.consultationTitle}>{consultation.title}</div>
                </Link>
                <Link to={routes.consultationShowLocation.toUrl({ consultationSlug: consultation.slug })}>
                    <div className={styles.consultationButtonContainer}>
                        {endDate < date ?
                            <span><FormattedMessage id="consultation.consultation_box.action_show_result" defaultMessage={"Show result"} /></span>
                        :
                            <span><FormattedMessage id="consultation.consultation_box.action_consultation_participate" defaultMessage={"Participate"} /></span>
                        }
                        <ArrowIcon width={18} height={18} className={styles.arrowIcon} />
                    </div>
                </Link>
                <div className={styles.consultationInformations}>
                    <div className={styles.consultationLeft}>
                        <div className={cx(styles.consultationGroupInformation, styles.consultationGroupRight)}>
                            <span className={styles.consultationTextInformation}>{consultation.proposals_count}</span>
                            <ChatIcon width={15} height={20} {...(config.theme.iconTheme === "edge" && {variant: "edge"})} />
                        </div>
                        <div className={styles.consultationGroupInformation}>
                            <span className={styles.consultationTextInformation}>{consultation.total_participants}</span>
                            <UserIcon width={15} height={20} />
                        </div>
                    </div>
                    <div className={cx(styles.consultationGroupInformation, styles.progressBarContainer)}>
                        {endDate < date ?
                            <FormattedMessage id="consultation.consultation_box.stats_votes" values={{ votesCount: consultation.total_votes }} defaultMessage={"{votesCount} votes"} />
                        :
                            <ProgressBar 
                                className={styles.progress} 
                                innerClassName={styles.bar} 
                                progress={consultation.total_votes} 
                                goal={consultation.vote_goal}
                                showProgressSubtitle={true}
                                progressUnit={"votes"}
                            />
                        }
                    </div>
                </div>
            </div>
        </>
    );
};

