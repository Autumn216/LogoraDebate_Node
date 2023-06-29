import React, { useState, useEffect } from 'react';
import { withAlert } from "../store/AlertProvider";
import { buildPath } from '../config/routes';
import { CheckboxIcon } from '@logora/debate.icons';
import { useLocation } from 'react-router';
import { useRoutes, useConfig } from '@logora/debate.context.config_provider';
import { useDataProvider } from '@logora/debate.data.data_provider';
import { useAuth } from "@logora/debate.auth.use_auth";
import { useIntl, FormattedMessage } from 'react-intl';
import { useAuthenticationRequired } from "@logora/debate.hooks.use_authentication_required";
import { Link } from '@logora/debate.action.link';
import ProgressBar from "@logora/debate.tools.progress_bar";
import { getSessionStorageItem, setSessionStorageItem, removeSessionStorageItem } from "../utils/SessionStorage";
import cx from 'classnames';
import styles from './VoteBox.module.scss';

const VoteBox = (props) => {
    const [isLoadingVote, setIsLoadingVote] = useState(true);
    const [currentVote, setCurrentVote] = useState(undefined);
    const [showResults, setShowResults] = useState(false);
    const [totalVotes, setTotalVotes] = useState(parseFloat(props.debate && props.debate.votes_count.total) || Object.values(props.debate && props.debate.votes_count).reduce((sum,value)=> sum + parseFloat(value), 0) || 0);
    const [votePositions, setVotePositions] = useState(props.votePositions || []);

    const initVotesCount = () => {
        const votesCountObj = {};
        props.votePositions && props.votePositions.forEach(position => 
            votesCountObj[position.id] = {
                count: parseFloat(props.debate && props.debate.votes_count[position.id]) || 0, 
                percentage: totalVotes === 0 ? 0 : Math.round(100 * ((props.debate && props.debate.votes_count[position.id] || 0) / (totalVotes)))
            }
        );

        return votesCountObj;
    }
    const [votesCount, setVotesCount] = useState(initVotesCount());

    const requireAuthentication = useAuthenticationRequired();
    const location = useLocation();
    const api = useDataProvider();
    const routes = useRoutes();
    const config = useConfig();
    const intl = useIntl();
    const { isLoggedIn, isLoggingIn } = useAuth();

    useEffect(() => {
        if (isLoggingIn === false) {
            if (isLoggedIn) { 
                getVote(props.debate.id);
            } else {
                setIsLoadingVote(false);
            }
        }
    }, [isLoggingIn, isLoggedIn])

    useEffect(() => {
        if (isLoadingVote === false && !props.redirectAfterVote) {
            const [initVote, positionId] = getStoredVote();
            if (initVote) {
                if (!positionId) { 
                    setShowResults(true); 
                } else {
                    handleVote(positionId);
                }
            }
        }
    }, [isLoadingVote])

    const getStoredVote = () => {
        if (getSessionStorageItem("storedUserVote")) {
            const storedUserVote = JSON.parse(getSessionStorageItem("storedUserVote"));
            return [true, storedUserVote.positionId]
        } else {
            const urlParams = new URLSearchParams(location.search);
            const initVote = Boolean(urlParams.get('initVote'));
            const positionId = parseInt(urlParams.get('positionId')) || false;
            return [initVote, positionId];
        }
    }

    const getVote = (debateId) => {
        setIsLoadingVote(true);
        api.getOneWithToken("votes", `${props.voteableType.toLowerCase()}/${debateId}`, {}).then(response => {
            if (response.data.data.resource) {
                setCurrentVote(response.data.data.resource);
                setShowResults(true);
                setIsLoadingVote(false);
                props.onAddVote(response.data.data.resource.position_id);
            } else {
                setIsLoadingVote(false);
                setShowResults(false);
            }
        }).catch(error => {
            setIsLoadingVote(false);
        });
    }

    const getPercentageValue = (voteCount, totalVotes) => {
        return totalVotes === 0 ? 0 : Math.round(100 * (voteCount / (totalVotes)));
    }
    
    const voteAction = (positionId) => {
        const data = {
            voteable_id: props.debate.id,
            voteable_type: props.voteableType || 'Group',
            position_id: positionId
        }
        setSessionStorageItem("userSide", JSON.stringify(
            {
                groupId: props.debate.id,
                voteableType: props.voteableType,
                positionId: positionId
            }));
        if (currentVote) {
            updateVote(positionId, currentVote.position_id);
            props.onAddVote(positionId);
            showResults === false && toggleResults();
            if (positionId !==  currentVote.position_id) {
                api.update("votes", currentVote.id, data).then(response => {
                    if(response.data.success) {
                        setCurrentVote(response.data.data.resource)
                    }
                });
            }
        } else {
            addVote(positionId);
            props.onAddVote(positionId);
            toggleResults();
            api.create("votes", data).then(response => {
                if(response.data.success) {
                    setCurrentVote(response.data.data.resource);
                    props.toastAlert("header.vote_confirm_modal", "success", 1, "VOTE", "alert.first_vote");
                }
            });
        }
    }

    const addVote = (positionId) => {
        const newCount = votesCount[positionId].count + 1;
        const newTotal = totalVotes + 1;
        const newVotesCount = {};
        votePositions.forEach((element) => {
            if(positionId === element.id) {
                newVotesCount[element.id] = { count: newCount, percentage: getPercentageValue(newCount, newTotal) };
            } else {
                const newElementCount = votesCount[element.id].count;
                newVotesCount[element.id] = { count: newElementCount, percentage: getPercentageValue(newElementCount, newTotal) };
            }
        });
        setVotesCount(newVotesCount);
        setTotalVotes(newTotal);
    }

    const updateVote = (newPosition, previousPosition) => {
        if (previousPosition !== newPosition){
            const newVotesCount = {
                ...votesCount,
                [previousPosition]: { count: votesCount[previousPosition].count - 1,
                    percentage: getPercentageValue(votesCount[previousPosition].count - 1, totalVotes) },
                [newPosition]: { count: votesCount[newPosition].count + 1,
                    percentage: getPercentageValue(votesCount[newPosition].count + 1, totalVotes) }
            }
            setVotesCount(newVotesCount);
        }
    }

    const getRedirectUrl = (positionId) => {
        const debatePath = buildPath(routes, routes.debateShowLocation.toUrl({ debateSlug: props.debate.slug }));
        if(config.provider.url) {
            let debateUrl = new URL(debatePath, config.provider.url);
            if(positionId) {
                debateUrl.searchParams.append("positionId", positionId);
            }
            debateUrl.searchParams.append("initVote", "true");
            if (config.analytics && config.analytics.disableCampaignTracking !== true) {
                debateUrl.searchParams.append("utm_source", "article");
                debateUrl.searchParams.append("utm_campaign", config.source && config.source.uid);
                debateUrl.searchParams.append("utm_content", props.debate.slug);
                debateUrl.searchParams.append("mtm_keyword", config.source && config.id != 191 && config.source.source_url);
                debateUrl.searchParams.append("mtm_cid", config.id);
            }
            return debateUrl.href;
        } else {
            let debateUrl = new URL(debatePath, "https://logora.fr");
            if(positionId) {
                debateUrl.searchParams.append("positionId", positionId);
            }
            debateUrl.searchParams.append("initVote", "true");
            if (config.analytics &&  config.analytics.disableCampaignTracking !== true) {
                debateUrl.searchParams.append("utm_source", "article");
                debateUrl.searchParams.append("utm_campaign", config.source && config.source.uid);
                debateUrl.searchParams.append("utm_content", props.debate.slug);
                debateUrl.searchParams.append("mtm_keyword", config.source && config.id != 191 && config.source.source_url);
                debateUrl.searchParams.append("mtm_cid", config.id);
            }
            return debateUrl.href.replace("https://logora.fr", "");
        }
    }

    const handleVote = (positionId) => {
        if (isLoggedIn) {
            if (Object.keys(votesCount).includes(positionId.toString())) {
                voteAction(positionId);
                removeSessionStorageItem("storedUserVote");
            }
        } else {
            if (Object.keys(votesCount).includes(positionId.toString())) {
                setSessionStorageItem("storedUserVote", JSON.stringify(
                    {
                        groupId: props.debate.id,
                        voteableType: props.voteableType,
                        positionId: positionId
                    }
                ));
            }
            requireAuthentication({ loginAction: "vote" });
        }
    }

    const toggleResults = () => {
        if (showResults) { removeSessionStorageItem('userSide'); }
        setShowResults(!showResults);
    }

    const displayVotePosition = (position, index) => {
        return (
            <div key={index} className={cx(styles.voteAction)}>
                {typeof window !== "undefined" && props.redirectAfterVote !== true ?
                    <button 
                        data-tid={"action_vote"} 
                        type="button"
                        title={position.name}
                        className={cx(styles.voteButton, {[styles.voteButtonFullWidth]: props.fullWidthButton, [styles.voteButtonDisabled]: props.debate.is_active === false})}
                        onClick={() => handleVote(position.id)}
                        disabled={props.debate.is_active === false}
                    >
                        <div data-tid={"action_vote"} className={cx(styles.voteButtonThesis, {[styles.voteButtonThesisSynthesisMobile]: !props.displayColumn })}>{position.name}</div>
                    </button>
                    :
                    <Link 
                        to={getRedirectUrl(position.id)}
                        target="_top"
                        data-tid={"action_vote_embed"}
                        className={cx(styles.voteButton, {[styles.voteButtonFullWidth]: props.fullWidthButton, [styles.voteButtonDisabled]: props.debate.is_active === false})}
                        rel="nofollow"
                        title={position.name}
                        external
                        disabled={props.debate.is_active === false}
                    >
                        <div data-tid={"action_vote_embed"} className={cx(styles.voteButtonThesis, {[styles.voteButtonThesisSynthesisMobile]: !props.displayColumn})}>{position.name}</div>
                    </Link>
                }
            </div>
        );
    }

    const displayImage = (position, members) => {
        const groupMember = members.find(element => element.position && element.position.id == position.id);
        return (
            <img className={styles.userImage} src={groupMember.user.image_url} alt={intl.formatMessage({ id:"vote.vote_box.profile_picture" }) + `${groupMember.user.full_name}`} height="25" width="25" />
        )
    }

    const handleShowResults = () => {
        if (isLoggedIn) {
            setShowResults(true);
        } else {
            requireAuthentication({ loginAction: "vote" });
        }
    }

    return (
        <div className={cx(styles.voteBox, { [styles.voteBoxBorder]: props.showBorder, [styles.voteBoxSynthesis]: props.paddingLeft, [styles.voteBoxHideArguments]: props.paddingRight } )} >
            <>
                { showResults || props.debate.is_active === false ? (
                    <div className={styles.voteResultsBox}>
                        <div className={styles.voteResults}>
                            {
                                votePositions.map((value, index) => {
                                    return (
                                        <div key={index}>
                                            <div className={index > 0 ? cx(styles.voteProgressHeader, styles.voteProgressHeaderAgainst) : styles.voteProgressHeader}>
                                                { props.displayImages && displayImage(value, props.debate.debate_members) } { value.name } {( currentVote && currentVote.position_id === value.id) ? <span title={intl.formatMessage({ id:"vote.vote_box.vote_side" }) + value.name } className={styles.sideIcon}><CheckboxIcon width={16} height={16} /></span> : null}
                                            </div>
                                            <ProgressBar 
                                                progress={votesCount[value.id].percentage / 100} 
                                                goal={1} 
                                                className={styles.progress} 
                                                innerClassName={styles.progressBar} 
                                                textClassName={styles.progressText}
                                            >
                                                { votesCount[value.id].percentage }%
                                            </ProgressBar>
                                        </div>
                                    );
                                })
                            }
                        </div>
                        <div className={styles.voteBoxFooter}>
                            <div className={styles.voteResultsNumberVoters}>
                                <FormattedMessage id="vote.vote_box.votes" values={{ votesCount: totalVotes }} defaultMessage="votes" />
                            </div>
                            {!props.debate.is_active === false &&
                                <div>
                                    { currentVote ?
                                        <button data-tid={"action_edit_vote"} className={styles.changeVoteButton} type="button" onClick={toggleResults}>
                                            <FormattedMessage id="vote.vote_box.update" defaultMessage="Modifier" />
                                        </button>
                                    :
                                        <div className={styles.backToVote} onClick={() => setShowResults(false)}>
                                            <FormattedMessage id="vote.vote_box.back" defaultMessage="Back to vote" />
                                        </div>
                                    }
                                </div>
                            }
                        </div>
                    </div>
                ) : (
                    <div className={cx(styles.voteBoxActions, {[styles.voteBoxActionsNewSynthesis]: props.noPadding})}>
                        <div className={cx(styles.voteBoxActionsBody, { [styles.voteBoxActionsBodyColumn]: props.displayColumn, [styles.voteActionSpacing]: props.spaceBetweenButton, [styles.voteBoxActionsBodyRow]: props.displayColumn === false && config.synthesis.newDesign, [styles.voteBoxActionsBodyUnwrapped]: (votePositions[0].name.length <= 4 && votePositions[1].name.length <= 4)})}>
                            {props.onlyTwoThesis ?
                                votePositions.slice(0, 2).map((value, index) => displayVotePosition(value, index))
                            :
                                votePositions.map((value, index) => displayVotePosition(value, index))
                            }
                        </div>
                        <div className={cx(styles.voteBoxActions, styles.voteBoxShowResultContainer, {[styles.voteBoxShowResultContainerSynthesis]: props.smallShowResult})}>
                            <div className={styles.voteBoxShowResult}>
                                {typeof window !== "undefined" && props.redirectAfterVote !== true ?
                                    <div onClick={() => handleShowResults()} data-tid="show_vote_result">
                                        <span><FormattedMessage id="vote.vote_box.votes" values={{ votesCount: totalVotes }} /> - <span className={styles.boldShowResult}><FormattedMessage id="vote.vote_box.show_result" defaultMessage="Show result" /></span></span>
                                    </div>
                                :
                                    <Link to={getRedirectUrl(null)} rel="nofollow" data-tid="show_vote_result" target="_top" external>
                                        <span><FormattedMessage id="vote.vote_box.votes" values={{ votesCount: totalVotes }} /> - <span className={styles.boldShowResult}><FormattedMessage id="vote.vote_box.show_result" defaultMessage="Show result" /></span></span>
                                    </Link>
                                }
                            </div> 
                        </div>
                    </div>
                )} 
            </>
        </div>
    )
}

export default withAlert(VoteBox);
