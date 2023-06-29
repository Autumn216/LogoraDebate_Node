import React, { useState, useEffect } from 'react';
import { useRoutes } from '@logora/debate.context.config_provider';
import { useAuth } from "@logora/debate.auth.use_auth";
import { useDataProvider } from '@logora/debate.data.data_provider';
import { useIntl } from 'react-intl';
import { useAuthenticationRequired } from "@logora/debate.hooks.use_authentication_required";
import { ShareButton } from '@logora/debate.share.share_button';
import { Tag } from '@logora/debate.tag.tag';
import ChallengeFooter from './ChallengeFooter';
import { FollowButton } from '@logora/debate.follow.follow_button';
import ChallengeUserBox from './ChallengeUserBox';
import ProgressBar from "@logora/debate.tools.progress_bar";
import ChallengeVoteButton from './ChallengeVoteButton';
import { ArrowIcon } from "@logora/debate.icons";
import { FormattedDate } from 'react-intl';
import { Link } from 'react-router-dom';
import cx from 'classnames';
import styles from './ChallengeContext.module.scss';

const ChallengeContext = (props) => {
    const firstPositionIndex = props.debate.group_context.positions[0].id === props.debate.debate_members[0].position.id ? 0 : 1;
    const secondPositionIndex = firstPositionIndex === 0 ? 1 : 0;
    const firstUserPositionId = props.debate.group_context.positions.find(position => position.id === props.debate.debate_members[0].position.id).id;
    const secondUserPositionId = props.debate.group_context.positions.find(position => position.id === props.debate.debate_members[1].position.id).id;

    const [activeVote, setActiveVote] = useState(false);
    const [voteSide, setVoteSide] = useState(true);
    const [voteId, setVoteId] = useState();
    const [totalUpvotes, setTotalUpvotes] = useState(parseInt(props.debate.votes_count[props.debate.debate_members[0].position.id]) || 0);
    const [totalDownvotes, setTotalDownvotes] = useState(parseInt(props.debate.votes_count[props.debate.debate_members[1].position.id]) || 0);
    const [voteDisabled, setVoteDisabled] = useState(false);
    const [hasVoted, setHasVoted] = useState(false);
	const requireAuthentication = useAuthenticationRequired();
    const api = useDataProvider();
    const intl = useIntl();
    const routes = useRoutes();
    const { isLoggedIn } = useAuth();

    const getVote = (debateId) => {
        api.getOneWithToken("votes/debate", debateId, {}).then(response => {
            if(response.data.success) {
                if(response.data.data.resource) {
                    let initVote = response.data.data.resource;
                    setHasVoted(true);
                    setActiveVote(Boolean(initVote));
                    setVoteSide(initVote && initVote.position_id === firstUserPositionId ? true : false);
                    setVoteId(initVote && initVote.id);
                }
            }
        }, error => {
            null
        })
    }

    useEffect(() => {
        if (isLoggedIn && !hasVoted) {
            getVote(props.debate.id);
        }
    }, [isLoggedIn]);

    const activateVote = (isUpvote) => {
        setActiveVote(true);
        setVoteSide(isUpvote);
        if(isUpvote) {
            setTotalUpvotes(totalUpvotes + 1);
        } else {
            setTotalDownvotes(totalDownvotes + 1);
        }
    }

    const deactivateVote = (isUpvote) => {
        setActiveVote(false);
        if(isUpvote) {
            setTotalUpvotes(totalUpvotes - 1);
        } else {
            setTotalDownvotes(totalDownvotes - 1);
        }
    }

    const voteAction = (isUpvote) => {
        if(activeVote) {
            if (voteSide == isUpvote) {
                deactivateVote(isUpvote);
                setVoteDisabled(true);
                api.delete("votes", voteId).then(response => {
                    if(response.data.success) {
                        setVoteId(null);
                        setVoteDisabled(false);
                    } else {
                        activateVote(isUpvote);
                        setVoteDisabled(false);
                    }
                }, response => {
                    activateVote(isUpvote);
                    setVoteDisabled(false);
                });
            } else {
                deactivateVote(!isUpvote);
                activateVote(isUpvote);
                let data = {};
                if(isUpvote) {
                    data = {
                        position_id : firstUserPositionId,
                    }
                } else {
                    data = {
                        position_id : secondUserPositionId,
                    }
                }
                setVoteDisabled(true);
                api.update("votes", voteId, data).then(response => {
                    if(response.data.success) {
                        setVoteDisabled(false);
                    }
                }, response => {
                    deactivateVote(isUpvote);
                    activateVote(!isUpvote);
                    setVoteDisabled(false);
                });
            }
        } else {
            let data = {
                voteable_id: props.debate.id,
                voteable_type: "Debate",
            };
            if(isUpvote) {
                data = {...data, position_id: firstUserPositionId,};
            } else {
                data = {...data, position_id: secondUserPositionId,};
            }
            activateVote(isUpvote);
            setVoteDisabled(true);
            api.create("votes", data).then(response => {
                if(response.data.success) {
                    setVoteId(response.data.data.resource.id);
                    setVoteDisabled(false);
                }
            }, error => {
                deactivateVote(isUpvote);
                setVoteDisabled(false);
            });
        }
    }

    const handleVote = (isUpvote) => {
        if(!voteDisabled) {
            if (isLoggedIn) {
                voteAction(isUpvote);
            } else {
                requireAuthentication({ loginAction: "vote" });
            }
        }
    }

    const displayTag = (tag, index) => {
        return (
            <div className={styles.tagItem} key={index}>
                <Link data-tid={"action_search_debate_tag"} to={{ pathname: routes.searchLocation.toUrl(), search: `?q=${tag.display_name}` }}>
                    <Tag dataTid={"action_search_debate_tag"} text={tag.display_name} />
                </Link>
            </div>
        );
    }

    return (
        <>
            <Link to={routes.challengeIndexLocation.toUrl()} className={styles.link}>
                <ArrowIcon width={24} height={24} />
                { intl.formatMessage({ id: "challenge.index.link" }) }
            </Link>
            <div className={styles.debateContext}>
                <div className={styles.firstUserBox}>
                    <ChallengeUserBox 
                        user={props.debate.from_argument ? props.debate.debate_members[1] : props.debate.debate_members[0]} 
                        position={props.debate.from_argument ? secondPositionIndex : firstPositionIndex}
                        isFinished={props.debate.current_phase === "finished"}
                        isWinner={props.debate.from_argument ? props.debate.votes_count[secondUserPositionId] > props.debate.votes_count[firstUserPositionId] : props.debate.votes_count[firstUserPositionId] > props.debate.votes_count[secondUserPositionId]}
                    />
                    {props.debate.current_phase === "vote" &&
                        <>
                            <div className={styles.userBar}>
                                <ProgressBar 
                                    progress={props.debate.from_argument ? totalDownvotes : totalUpvotes}
                                    goal={totalDownvotes + totalUpvotes}
                                    className={styles.userBarProgress} 
                                    innerClassName={cx(styles.bar, styles[`position-${props.debate.from_argument ? secondPositionIndex + 1 : firstPositionIndex + 1}`])} 
                                    showPercentageSubtitle={true}
                                    subtitleClassName={cx(styles.userBarPercentage, styles[`position-${props.debate.from_argument ? secondPositionIndex + 1 : firstPositionIndex + 1}`])}
                                />
                            </div>
                            <div onClick={() => handleVote(props.debate.from_argument ? false : true)}>
                                <ChallengeVoteButton 
                                    position={props.debate.from_argument ? secondPositionIndex : firstPositionIndex}
                                    isVoteActive={props.debate.from_argument ? activeVote && !voteSide : activeVote && voteSide}
                                />
                            </div>
                        </>
                    }
                    {props.debate.current_phase === "finished" &&
                        <div className={styles.userBar}>
                            <ProgressBar 
                                progress={props.debate.from_argument ? totalDownvotes : totalUpvotes}
                                goal={totalDownvotes + totalUpvotes}
                                className={styles.userBarProgress} 
                                innerClassName={cx(styles.bar, styles[`position-${props.debate.from_argument ? secondPositionIndex + 1 : firstPositionIndex + 1}`])} 
                                showPercentageSubtitle={true}
                                subtitleClassName={cx(styles.userBarPercentage, styles[`position-${props.debate.from_argument ? secondPositionIndex + 1 : firstPositionIndex + 1}`])}
                            />
                        </div>
                    }
                </div>
                <div className={styles.debateTitleBox}>
                    <div className={styles.debateHeader}>
                        <div className={styles.debateDate}>
                            <span>{ intl.formatMessage({ id: "challenge.created" }) }</span><FormattedDate value={new Date(props.debate.created_at)} year="numeric" month="long" day="2-digit" />
                        </div>
                        <div className={styles.debateTitle}>{ props.debate.group_context.name }</div>
                        <div className={styles.debateTagList}>{ props.debate.group_context.tags.map(displayTag)}</div>
                    </div>
                    <div className={styles.debateActionsBox}>
                        <div className={styles.debateShareAction}>
                            <ShareButton 
                                shareUrl={"https://app.logora.fr/share/d/" + props.debate.id} 
                                shareTitle={intl.formatMessage({ id: "share.debate.title" })} 
                                shareText={intl.formatMessage({ id: "share.debate.text" })} 
                                showText 
                            />
                        </div>
                        <div className={styles.debateFollowAction}>
                            <FollowButton followableType={"debate"} followableId={props.debate.id} tooltipText={intl.formatMessage({ id: "follow.follow_debate", defaultMessage: "Follow the debate activity and keep track of your contributions on your profile" })} dataTid={"action_follow_debate"} />
                        </div>
                    </div>
                    <div className={styles.debateFooter}>
                        <ChallengeFooter 
                            debate={props.debate}
                            nextUser={props.nextUser}
                            currentPhase={props.currentPhase} 
                            currentRound={props.currentRound} 
                            totalVotes={totalDownvotes + totalUpvotes}
                        />
                    </div>
                </div>
                <div className={styles.secondUserBox}>
                    {props.debate.debate_members[1] && 
                        <ChallengeUserBox 
                            user={props.debate.from_argument ? props.debate.debate_members[0] : props.debate.debate_members[1]} 
                            position={props.debate.from_argument ? firstPositionIndex : secondPositionIndex}
                            isFinished={props.debate.current_phase === "finished"}
                            isWinner={props.debate.from_argument ? props.debate.votes_count[secondUserPositionId] < props.debate.votes_count[firstUserPositionId] : props.debate.votes_count[firstUserPositionId] < props.debate.votes_count[secondUserPositionId]}
                        />
                    }
                    {props.debate.current_phase === "vote" &&
                        <>
                            <div className={styles.userBar}>
                                <ProgressBar 
                                    progress={props.debate.from_argument ? totalUpvotes : totalDownvotes}
                                    goal={totalDownvotes + totalUpvotes}
                                    className={styles.userBarProgress}
                                    innerClassName={cx(styles.bar, styles[`position-${props.debate.from_argument ? firstPositionIndex + 1 : secondPositionIndex + 1}`])} 
                                    showPercentageSubtitle={true}
                                    subtitleClassName={cx(styles.userBarPercentage, styles[`position-${props.debate.from_argument ? firstPositionIndex + 1 : secondPositionIndex + 1}`])}
                                />
                            </div>
                            <div onClick={() => handleVote(props.debate.from_argument ? true : false)}>
                                <ChallengeVoteButton 
                                    position={props.debate.from_argument ? firstPositionIndex : secondPositionIndex}
                                    isVoteActive={props.debate.from_argument ? activeVote && voteSide : activeVote && !voteSide}
                                />
                            </div>
                        </>
                    }
                    {props.debate.current_phase === "finished" &&
                        <div className={styles.userBar}>
                            <ProgressBar 
                                progress={props.debate.from_argument ? totalUpvotes : totalDownvotes}
                                goal={totalDownvotes + totalUpvotes}
                                className={styles.userBarProgress}
                                innerClassName={cx(styles.bar, styles[`position-${props.debate.from_argument ? firstPositionIndex + 1 : secondPositionIndex + 1}`])} 
                                showPercentageSubtitle={true}
                                subtitleClassName={cx(styles.userBarPercentage, styles[`position-${props.debate.from_argument ? firstPositionIndex + 1 : secondPositionIndex + 1}`])}
                            />
                        </div>
                    }
                </div>
                <div className={styles.debateFooterMobile}>
                    <ChallengeFooter 
                        debate={props.debate}
                        nextUser={props.nextUser} 
                        currentPhase={props.currentPhase} 
                        currentRound ={props.currentRound} 
                        totalVotes={totalDownvotes + totalUpvotes}
                    />
                </div>
            </div>     
        </>   
    );
}

export default ChallengeContext;
