import React, { useState } from 'react';
import { useConfig, useRoutes } from '@logora/debate.context.config_provider';
import { useAuth } from "@logora/debate.auth.use_auth";
import { useResponsive } from "@logora/debate.hooks.use_responsive";
import { useIntl } from 'react-intl';
import { useReportContent } from "@logora/debate.hooks.use_report_content";
import { useDeleteContent } from "@logora/debate.hooks.use_delete_content";
import { Dropdown } from '@logora/debate.tools.dropdown';
import TextFormatter from '../utils/TextFormatter';
import { Link } from '@logora/debate.action.link'; 
import { EllipsisIcon, UserIcon } from '@logora/debate.icons';
import ProgressBar from "@logora/debate.tools.progress_bar";
import SuggestionVoteBox from './SuggestionVoteBox';
import styles from './SuggestionBoxFooter.module.scss';
import cx from 'classnames';

const SuggestionBoxFooter = (props) => {
    const [isVoted, setIsVoted] = useState(false);
    const { currentUser } = useAuth();
    const [totalUpvotes, setTotalUpvotes] = useState(props.suggestion.total_upvotes);
    const [isMobile, isTablet, isDesktop] = useResponsive();
    const config = useConfig();
    const routes = useRoutes();
    const intl = useIntl();
	const { reportContent } = useReportContent("DebateSuggestion", props.suggestion.id, intl.formatMessage({ id: "header.report_proposal" }));
    const { deleteContent } = useDeleteContent(props.suggestion, 
                                                "debate_suggestions", 
                                                "suggestionsList", 
                                                intl.formatMessage({ id: "info.delete_suggestion" }),
                                                intl.formatMessage({ id: "info.confirm_delete_suggestion" }),
                                                "alert.suggestion_delete");

    const activeVote = (isUpvote) => {
        if (isUpvote) {
            setTotalUpvotes(totalUpvotes + 1);
            setIsVoted(true);
        } else {
            setTotalUpvotes(totalUpvotes - 1);
            setIsVoted(false);
        }
    }

    const currentUserIsAuthor = () => {
        return props.suggestion.author.id === currentUser.id;
    }
    
    return (
        <div className={cx(styles.container, {[styles.containerIsMobile]: isMobile, [styles.isSelected]: props.suggestion.is_accepted === true})}>
            <div className={cx(styles.questionContainer, {[styles.notSelected]: props.suggestion.is_accepted === false})}>
                {props.suggestion.is_published && props.suggestion.is_accepted && props.suggestion.group && 
                    <div className={cx(styles.voteButton, {[styles.active]: isVoted, [styles.voteButtonIsMobile]: isMobile, [styles.hideElement]: props.suggestion.is_accepted && props.suggestion.is_published === false})}>
                        <Link className={styles.linkToDebate} to={routes.debateShowLocation.toUrl({debateSlug: props.suggestion.group.slug})}>
                            <TextFormatter id="action.link_to_debate" />
                        </Link>
                    </div>
                }
                {props.suggestion.is_accepted === false && props.suggestion.is_expired === false &&
                    <>
                        <SuggestionVoteBox voteableType={"DebateSuggestion"} voteableId={props.suggestion.id} totalUpvotes={totalUpvotes} totalDownvotes={props.suggestion.total_downvotes} onVote={(isUpvote) => activeVote(isUpvote)} />
                    </>
                }
            </div>
            <div className={cx(styles.voteContainer, {[styles.voteFullWidth]: props.suggestion.is_accepted === false || props.suggestion.is_accepted && props.suggestion.is_published === false})}>
                <div className={cx(styles.progressBarContainer, {[styles.progressBarContainerIsMobile]: isMobile, [styles.progressBarSelected]: props.suggestion.is_accepted && props.suggestion.is_published === false, [styles.hideElement]: props.suggestion.is_accepted && props.suggestion.is_published, [styles.active]: isVoted})}>
                    <div className={styles.userProgress}>
                        <span>{totalUpvotes || 0}/{config.modules.suggestions && config.modules.suggestions.vote_goal || 30}</span>
                        <UserIcon width={13} height={13} />
                        <span><TextFormatter id="suggestion.user.debate" count={totalUpvotes}/></span>
                    </div>
                    <div className={styles.goals}>
                        <ProgressBar 
                            className={styles.suggestionProgress} 
                            innerClassName={styles.bar} 
                            progress={totalUpvotes} 
                            goal={config.modules.suggestions && config.modules.suggestions.vote_goal || 30}
                        />
                    </div>
                </div>
                <div className={cx(styles.actionsContainer, {[styles.actionsContainerSelected]: props.suggestion.is_accepted && props.suggestion.is_published === false})}>
                    <Dropdown dropdownListRight={true} closeOnContentClick={true}>
                        <EllipsisIcon width={25} height={25} />
                        <div>
                            {currentUserIsAuthor() ? (
                                <div
                                    className={styles.dropdownItem}
                                    tabIndex='0'
                                    onClick={() => deleteContent()}
                                >
                                    <TextFormatter id='action.delete' />
                                </div>
                            ) : null}
                            <div
                                className={styles.dropdownItem}
                                onClick={() => reportContent()}
                            >
                                <TextFormatter id='action.report' />
                            </div>
                        </div>
                    </Dropdown>
                </div>
            </div>
        </div>
    )
}

export default SuggestionBoxFooter;
