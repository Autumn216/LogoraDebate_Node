import React from 'react';
import styles from './ChallengeFooter.module.scss';
import { withConfig } from '@logora/debate.context.config_provider';
import { injectIntl } from 'react-intl';
import TextFormatter from "../../utils/TextFormatter";
import { useRelativeTime } from '@logora/debate.hooks.use_relative_time';
import cx from 'classnames';

const ChallengeFooter = (props) => {
    const nextUser = props.debate.debate_members.find(userObject => userObject.user.id === props.debate.next_user_id);
    const firstUserPositionId = props.debate.group_context.positions.find(position => position.id === props.debate.debate_members[0].position.id).id;
    const secondUserPositionId = props.debate.group_context.positions.find(position => position.id === props.debate.debate_members[1].position.id).id;
    const winner = props.debate.votes_count[firstUserPositionId] > props.debate.votes_count[secondUserPositionId] ? props.debate.debate_members.find(position => position.position.id === firstUserPositionId) : props.debate.debate_members.find(position => position.position.id === secondUserPositionId);
    const relativeTime = useRelativeTime(props.debate.vote_ended_at ? new Date(props.debate.vote_ended_at).getTime() : new Date().getTime());

    const displayImage = (user) => {
        const { intl } = props;
            return (
                <>
                    {user ? 
                        <div className={styles.userImageFooter}>
                            <img 
                                src={user.user.image_url} 
                                width={25} 
                                height={25}
                                className={cx(styles.userImagestyles, styles.smallUserImage, {[styles.firstUserPosition]: user.position.id === props.debate.group_context.positions[0].id})} 
                                alt={intl.formatMessage({ id:"alt.profile_picture" }) + user.user.full_name } 
                                title={user.user.full_name} 
                            />
                        </div>
                    :
                        <div className={styles.emptyUserImage}></div>
                    }
                </>
            );
    }

    return (
        <div className={cx(styles.challengeBoxFooter, {[styles.zeroPaddingBox]: props.zeroPadding})}>
            <div className={styles.left}>
                { !props.currentPhase || props.currentPhase === "unstarted" &&
                    <div className={cx(styles.unstartedPhase, styles.versusPhase)}>
                        <span className={styles.footerText}>
                            <TextFormatter id="info.duel_pending" />
                        </span>
                    </div>
                }
                { props.currentPhase === "debate" && !props.debate.expired &&
                    <div className={cx(styles.debatePhase, styles.versusPhase)}>
                        <span className={styles.footerText}>
                            {props.currentRound == 1 && <span><TextFormatter id={"info.duel_first_round"} /></span>}
                            {props.currentRound == 2 && <span><TextFormatter id={"info.duel_second_round"} /></span>}
                            {props.currentRound == 3 && <span><TextFormatter id={"info.duel_third_round"} /></span>}
                            {props.currentRound == 4 && <span><TextFormatter id={"info.duel_fourth_round"} /></span>}
                            {props.currentRound == 5 && <span><TextFormatter id={"info.duel_fifth_round"} /></span>}
                        </span>
                    </div>
                }
                { props.currentPhase === "vote" && !props.debate.expired &&
                    <>
                        <div className={styles.votePhase}>
                            <span className={styles.voteText}>
                                <TextFormatter id="info.duel_vote_phase" />
                            </span>
                            <span className={styles.voteTimeText}>
                                {props.debate.vote_ended_at ? { relativeTime } : <span>-</span>}
                            </span>
                        </div>
                        <div className={styles.votesCount}>
                            <TextFormatter id="stats.votes" count={props.totalVotes ? props.totalVotes : 0} variables={{ votesCount: props.totalVotes ? props.totalVotes : 0}} />
                        </div>
                    </>
                }
                { props.currentPhase === "finished" &&
                    <div className={cx(styles.finishedPhase, styles.versusPhase)}>
                        <span className={styles.footerText}>
                            <TextFormatter id="info.challenge_finished" />
                        </span>
                    </div>
                }
                { props.currentPhase !== "finished" && props.debate.expired &&
                    <div className={cx(styles.finishedPhase, styles.versusPhase)}>
                        <span className={styles.footerText}>
                            <TextFormatter id="info.challenge_finished" />
                        </span>
                    </div>
                }
            </div>
            <div className={styles.right}>
                <div className={styles.timeLeft}>
                    { props.currentPhase === "debate" && !props.debate.expired &&
                        <>
                        {nextUser && nextUser.id ?
                            <>
                                <div className={styles.userImageBackground}>
                                    {displayImage(nextUser)}
                                </div>
                                <div className={styles.footerText}>
                                    <TextFormatter id={"info.duel_user_round"} />
                                </div>
                            </>
                        :
                            <span><TextFormatter id={"closed_group.user_empty"} /></span>
                        }
                            
                        </>
                    }

                    { props.currentPhase === "finished" &&
                        <>
                            <div className={cx(styles.votesCount, styles.votesCountFinished)}>
                                <TextFormatter id="stats.votes" count={props.totalVotes ? props.totalVotes : 0} variables={{ votesCount: props.totalVotes ? props.totalVotes : 0}} />
                            </div>
                            <div className={styles.userImageBackground}>
                                {displayImage(winner)}
                            </div>
                            <div className={styles.footerText}>
                                {Object.values(props.debate.votes_count)[0] == Object.values(props.debate.votes_count)[1] ?
                                    <TextFormatter id={"info.duel_draw"} />
                                :
                                    <TextFormatter id={"info.duel_winner"} />
                                }
                            </div>
                        </>
                    }
                </div>
            </div>
        </div>
    );
}

export default injectIntl(withConfig(ChallengeFooter));
