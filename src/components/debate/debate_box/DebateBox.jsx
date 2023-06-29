import React, { useState, useEffect } from 'react';
import cx from 'classnames';
import styles from './DebateBox.module.scss';
import { Link } from 'react-router-dom';
import { useConfig, useRoutes } from '@logora/debate.context.config_provider';
import { Avatar } from '@logora/debate.user.avatar';
import { useIntl, FormattedMessage } from 'react-intl';
import { SuggestionIcon } from '@logora/debate.icons';
import { getWinningVote } from '@logora/debate.util.get_winning_vote';
import { useResponsive } from '@logora/debate.hooks.use_responsive';

export const DebateBox = props => {
    const [winningPosition, setWinningPosition] = useState();
    const [totalVotes, setTotalVotes] = useState(0);
    const config = useConfig();
    const routes = useRoutes();
    const intl = useIntl();
    const [isMobile, isTablet, isDesktop] = useResponsive();

    useEffect(() => {
        setTotalVotes(getWinningVote(props.debate.votes_count, props.debate.group_context.positions).totalVotes);
		setWinningPosition(getWinningVote(props.debate.votes_count, props.debate.group_context.positions).winningPositionObj);
	}, [])

    const getPercentageValue = (voteCount, totalVotes) => {
        if (totalVotes == 0 || voteCount == 0) { return 0; }
        return Math.round(100 * (voteCount / (totalVotes)));
    }

    const displayParticipant = (participant, index) => {
        return (
            <div className={styles.debateParticipantItem} key={index}>
                <Link to={routes.userShowLocation.toUrl({ userSlug: participant.slug })}>
                    <Avatar avatarUrl={participant.image_url} userName={participant.full_name} isOnline={(new Date(participant.last_activity) > Date.now())} />
                </Link>
            </div>
        );
    }

    return (
        <div className={cx(styles.debateBox, { [styles.mainDebateBox]: props.mainDebate })}>
            <div className={styles.debateBoxHeader}>
            <div className={styles.debateBoxImageBox}>
                <Link to={routes.debateShowLocation.toUrl({debateSlug: props.debate.slug})} className={styles.imageLink}>
                    {props.mainDebate === true ?
                        <img data-tid={"view_debate_image"} loading={"lazy"} className={cx(styles.debateBoxImage, styles.debateBoxMainImage)} src={props.debate.banner_image_url} height={290} alt={intl.formatMessage({ id:"debate.debate_box.alt_debate_image", defaultMessage: "Debate image " }) } />
                    :
                        <img data-tid={"view_debate_image"} loading={"lazy"} className={styles.debateBoxImage} src={props.debate.image_url} height={200} alt={intl.formatMessage({ id:"debate.debate_box.alt_debate_image", defaultMessage: "Debate image " }) } />
                    }
                </Link>
                { props.debate.is_active === false &&
                    <div className={styles.inactiveDebate}>
                        <FormattedMessage id="debate.debate_box.debate_is_inactive" defaultMessage={"Debate is ended"} />
                    </div>
                }
            </div>
            { props.debate.group_context.author && props.debate.group_context.author.is_admin === false &&
                <div className={styles.debateSuggestion}>
                    <span className={styles.authorSuggestion}>
                        <FormattedMessage id="debate.debate_box.suggestion_author_short" defaultMessage={"Suggested by"} />
                        <span className={styles.authorName}>{props.debate.group_context.author.full_name}</span>
                    </span>
                    <SuggestionIcon width={15} height={15} />
                </div>
            }
            
            </div>
            <div className={styles.debateBoxBody}>
                <div className={styles.debateBoxTitle} title={ props.debate.name }>
                    <Link to={routes.debateShowLocation.toUrl({debateSlug: props.debate.slug})}>
                        <>
                            { isMobile ?
                                <div data-tid={"view_debate_title"} className={cx(styles.debateTitle, styles.debateTitleMobile)}>
                                    { props.debate.name }
                                </div>
                            :
                                <div data-tid={"view_debate_title"} className={styles.debateTitle}>
                                    { props.debate.name }
                                </div>
                            }
                        </>
                    </Link>
                </div>
                <div className={styles.debateBoxFooter}>
                    <div className={styles.debateParticipantsBox}>
                        { props.debate.participants.length === 0 ? (
                            <span className={styles.debateParticipantsEmpty}>{intl.formatMessage({ id:"debate.debate_box.fallback_no_participants", defaultMessage:"No participants" }) }</span>
                        ) : (
                            <>
                                {props.debate.participants.map(displayParticipant)}
                                {props.debate.participants_count > 3 && 
                                    <div className={styles.debateParticipantItem}>
                                        <Link to={routes.debateShowLocation.toUrl({debateSlug: props.debate.slug})}>
                                            <div className={styles.participantsCountBox}>
                                                +{props.debate.participants_count - 3}
                                            </div>
                                        </Link>
                                    </div>
                                }
                            </>
                        )}
                    </div>
                    {config.modules.votes === false ?
                        null
                        :
                        <div className={styles.debateBoxNumbers}>
                            <div className={styles.debateBoxNumbersText}>
                                { winningPosition && (
                                    <>
                                        { getPercentageValue(winningPosition.count, totalVotes) } %{" "}
                                        { winningPosition.name }
                                    </>
                                )}
                            </div>
                        </div>
                    }
                </div>
            </div>
        </div>
    );
}