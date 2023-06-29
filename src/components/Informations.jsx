import React from 'react';
import { useConfig, useRoutes } from '@logora/debate.context.config_provider';
import { useResponsive } from "@logora/debate.hooks.use_responsive";
import { useHistory } from "react-router-dom";
import { useIntl } from "react-intl";
import AnnouncementDialog from '@logora/debate.dialog.announcement_dialog';
import InformationBox from '@logora/debate.information.information_box';
import TextFormatter from '../utils/TextFormatter';
import { PointIcon, ReplyIcon, SuggestionIcon, SuggestionCircleIcon, VersusIcon, ChatIcon, ArrowIcon, UpvoteIcon } from '@logora/debate.icons';
import cx from 'classnames';
import styles from './Informations.module.scss';

const Informations = (props) => {
    const history = useHistory();
    const intl = useIntl();
    const config = useConfig();
    const routes = useRoutes();
    const [ isMobile ] = useResponsive(); 

    return (
        <>
            <div className={styles.container}>
                <div className={styles.linkContainer}>
                    <div onClick={() => history.goBack()} className={styles.link}>
                        <ArrowIcon width={24} height={24} />
                        { intl.formatMessage({ id: "info_page.back_previous" }) }
                    </div>
                </div>
                <div className={styles.description}>
                    <div className={cx(styles.title, styles.titleDescription)}>
                        { intl.formatMessage({ id: "info.points" }) }
                    </div>
                    <div className={styles.descriptionBox}>
                        <div>{ intl.formatMessage({ id: "info_page.description.first" }) }</div>
                        <div>{ intl.formatMessage({ id: "info_page.description.second" }) }</div>
                    </div>
                </div>
                <div className={styles.title}>
                    { intl.formatMessage({ id: "info_page.rewards" }) }
                </div>
                <div className={styles.rewards}>
                    <div className={cx({[styles.rewardContainer]: !isMobile, [styles.rewardContainerMobile]: isMobile})}>
                        <InformationBox 
                            icon={SuggestionCircleIcon}
                            title={intl.formatMessage({ id: "info.suggestion"})}
                            points={100} 
                            description={intl.formatMessage({ id: "info_page.suggestion.description" })}
                            textLink={intl.formatMessage({ id: "info_page.suggestion.link" })}
                            link={routes.suggestionLocation.toUrl()}
                            isActive={config.modules.suggestions && config.modules.suggestions.active}
                        />
                    </div>
                    <div className={cx({[styles.rewardContainer]: !isMobile, [styles.rewardContainerMobile]: isMobile})}>
                        <InformationBox 
                            icon={VersusIcon}
                            title={intl.formatMessage({ id: "info_page.duel.title" })}
                            points={200} 
                            description={intl.formatMessage({ id: "info_page.duel.description" })}
                            textLink={intl.formatMessage({ id: "info_page.duel.link" })}
                            link={routes.challengeIndexLocation.toUrl()} 
                            isActive={config.modules.challenges}
                        />
                    </div>
                </div>
                <div className={styles.title}>
                    { intl.formatMessage({ id: "info_page.get_points" }) }
                </div>
                <div className={styles.points}>
                    <span className={styles.score}>
                        { intl.formatMessage({ id: "info.argument_score" }) }
                    </span>
                    {/*** Rédiger un argument ***/}
                    <AnnouncementDialog icon={ReplyIcon} fullWidth={isMobile ? true : false} className={cx({[styles.pointsContainer]: !isMobile, [styles.pointsContainerMobile]: isMobile})}>
                        <div className={styles.action}>
                            <span>{ intl.formatMessage({ id: "info_page.points.argument"  }) }</span>
                            <span className={styles.gain}>{ intl.formatMessage({ id: "alert.argument_create_gain" }) }<PointIcon width={20} height={20} /></span>
                        </div>
                    </AnnouncementDialog>

                    {/*** Rédiger une réponse ***/}
                    <AnnouncementDialog icon={ReplyIcon} fullWidth={isMobile ? true : false} className={cx({[styles.pointsContainer]: !isMobile, [styles.pointsContainerMobile]: isMobile})}>
                        <div className={styles.action}>
                            <span>{ intl.formatMessage({ id: "info_page.points.reply" }) }</span>
                            <span className={styles.gain}>{ intl.formatMessage({ id: "alert.reply_gain" }) }<PointIcon width={20} height={20} /></span>
                        </div>
                    </AnnouncementDialog>

                    {/*** Rédiger une proposition ***/}
                    <AnnouncementDialog icon={ChatIcon} fullWidth={isMobile ? true : false} className={cx({[styles.pointsContainer]: !isMobile, [styles.pointsContainerMobile]: isMobile})}>
                        <div className={styles.action}>
                            <span><TextFormatter id="info_page.points.consultation" /></span>
                            <span className={styles.gain}><TextFormatter id="info.point_eloquence" variables={{variable: "+5 "}} count={5} /><PointIcon width={20} height={20} /></span>
                        </div>
                    </AnnouncementDialog>

                    {/*** Terminer un duel ***/}
                    <AnnouncementDialog icon={VersusIcon} fullWidth={isMobile ? true : false} className={cx({[styles.pointsContainer]: !isMobile, [styles.pointsContainerMobile]: isMobile})} iconClassName={styles.versusIcon}>
                        <div className={styles.action}>
                            <span><TextFormatter id="info_page.points.duel" /></span>
                            <span className={styles.gain}><TextFormatter id="info.point_eloquence" variables={{variable: "+100 "}} count={100} /><PointIcon width={20} height={20} /></span>
                        </div>
                    </AnnouncementDialog>

                    {/*** Vote suggestion ***/}
                    <AnnouncementDialog icon={SuggestionIcon} fullWidth={isMobile ? true : false} className={cx({[styles.pointsContainer]: !isMobile, [styles.pointsContainerMobile]: isMobile})} iconClassName={styles.suggestionIcon}>
                        <div className={styles.action}>
                            <span><TextFormatter id="info_page.points.suggestion" /></span>
                            <span className={styles.gain}><TextFormatter id="info.point_eloquence" variables={{variable: "+50 "}} count={50} /><PointIcon width={20} height={20} /></span>
                        </div>
                    </AnnouncementDialog>

                    {/*** Suggestion de l'utilisateur ***/}
                    <AnnouncementDialog icon={SuggestionIcon} fullWidth={isMobile ? true : false} className={cx({[styles.pointsContainer]: !isMobile, [styles.pointsContainerMobile]: isMobile})} iconClassName={styles.suggestionIcon}>
                        <div className={styles.action}>
                            <span><TextFormatter id="info_page.points.user_suggestion" /></span>
                            <span className={styles.gain}><TextFormatter id="info.point_eloquence" variables={{variable: "+200 "}} count={200} /><PointIcon width={20} height={20} /></span>
                        </div>
                    </AnnouncementDialog>

                    {/*** Recevoir des votes sur argument ***/}
                    <AnnouncementDialog icon={UpvoteIcon} fullWidth={isMobile ? true : false} className={cx({[styles.pointsContainer]: !isMobile, [styles.pointsContainerMobile]: isMobile})}>
                        <div className={styles.action}>
                            <span><TextFormatter id="info_page.points.vote_argument" /></span>
                            <span className={styles.gain}><TextFormatter id="info.point_eloquence" variables={{variable: "+10 "}} count={10} /><PointIcon width={20} height={20} /></span>
                        </div>
                    </AnnouncementDialog>

                    {/*** Recevoir des votes sur réponse ***/}
                    <AnnouncementDialog icon={UpvoteIcon} fullWidth={isMobile ? true : false} className={cx({[styles.pointsContainer]: !isMobile, [styles.pointsContainerMobile]: isMobile})}>
                        <div className={styles.action}>
                            <span><TextFormatter id="info_page.points.vote_reply" /></span>
                            <span className={styles.gain}><TextFormatter id="info.point_eloquence" variables={{variable: "+10 "}} count={10} /><PointIcon width={20} height={20} /></span>
                        </div>
                    </AnnouncementDialog>

                    {/*** Recevoir des votes sur proposition ***/}
                    <AnnouncementDialog icon={UpvoteIcon} fullWidth={isMobile ? true : false} className={cx({[styles.pointsContainer]: !isMobile, [styles.pointsContainerMobile]: isMobile})}>
                        <div className={styles.action}>
                            <span><TextFormatter id="info_page.points.vote_proposal" /></span>
                            <span className={styles.gain}><TextFormatter id="info.point_eloquence" variables={{variable: "+10 "}} count={10} /><PointIcon width={20} height={20} /></span>
                        </div>
                    </AnnouncementDialog>
                </div>
            </div>
        </>
  )
}

export default Informations;