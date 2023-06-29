import React, { Suspense, lazy, useState, useEffect } from 'react';
import { useAuth } from "@logora/debate.auth.use_auth";
import { withRouter } from 'react-router-dom';
import { useDataProvider } from '@logora/debate.data.data_provider';
import { useIntl, FormattedMessage } from 'react-intl';
import { useList } from '@logora/debate.list.list_provider';
const ArgumentInput = lazy(() => import('../ArgumentInput'));
import { VoteProvider } from '@logora/debate.vote.vote_provider';
import Argument from '../Argument';
import { Loader } from '@logora/debate.tools.loader';
import ChallengeArgumentBlankBox from './ChallengeArgumentBlankBox';
import { useRelativeTime } from '@logora/debate.hooks.use_relative_time';
import cx from 'classnames';
import styles from './ChallengeBody.module.scss';

const ChallengeBody = (props) => {
    const intl = useIntl();
    const api = useDataProvider();
    const list = useList();
    const { currentUser } = useAuth();
    const [closedMessages, setClosedMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const timeRemaining = () => {
        let update = new Date(props.debate.updated_at);
        let oneWeekLater = new Date(update.getTime() + 7 * 24 * 60 * 60 * 1000);
        return oneWeekLater.getTime();
    }

    const relativeTime = useRelativeTime(timeRemaining());

    useEffect(() => {
        const { challengeSlug } = props.match.params;
        loadMessages(challengeSlug);
    }, [])

    useEffect(() => {
		if (list.addElements && Object.keys(list.addElements).length > 0) {
            const addElements = Object.values(list.addElements)[0];
			if (addElements.length > 0) {
				handleAddElements(addElements[0]);
				list.setAddElements({});
			}
		}
	}, [list.addElements]);

    useEffect(() => {
        if (list.updateElements && Object.keys(list.updateElements).length > 0) {
            const updateElements = Object.values(list.updateElements)[0];
			if (updateElements.length > 0) {
                handleUpdateArgument(updateElements[0]);
                list.setUpdateElements({});
            }
        }
    }, [list.updateElements])

    useEffect(() => {
        if (list.removeElements && Object.keys(list.removeElements).length > 0) {
            const removeElements = Object.values(list.removeElements)[0];
			if (removeElements.length > 0) {
                handleDeleteArgument(removeElements[0]);
                list.setRemoveElements({});
            }
        }
    }, [list.removeElements])

    const loadMessages = (challengeSlug) => {
		api.getList("debates/" + challengeSlug + "/messages", { page: 1, per_page: 10, sort: "+created_at" }).then(
			response => {
				if(response.data.success) {
					const message = response.data.data;
                    setClosedMessages(message);
                    setIsLoading(false);
				}
			}
		)
	}

    const displayImage = (nextUserId) => {
        const groupMember = props.debate.debate_members.filter(element => element.user.id == nextUserId)[0];
        return (
            <>
                {groupMember && groupMember.user ? 
                    <img src={groupMember.user.image_url} className={cx(styles.userImage, styles.itemLeft)} alt={intl.formatMessage({ id:"alt.profile_picture" }) + groupMember.user.full_name } title={groupMember.user.full_name} />
                :
                    <div className={styles.emptyUserImage}></div>
                }
            </>
        );
    }

    const handleUpdateRound = () => {
        if(props.debate.current_phase === "unstarted") {
            props.onCurrentPhaseChange("debate");
            props.onCurrentRoundChange(1);
        } else if (props.debate.current_phase === "debate") {
            if ((closedMessages.length + 1) % 2 === 0) {
                props.onCurrentRoundChange(props.currentRound + 1)
                if (props.currentRound === props.debate.number_rounds) {
                    props.onCurrentPhaseChange("vote");
                }
            }
        }
    }

    const handleAddArgument = (newArgument) => {
        let nextUser = props.debate.users.length > 1 ? props.debate.users.find(user => user.id != newArgument.author.id) : undefined
        if (newArgument && newArgument.id) {
            setClosedMessages([...closedMessages, newArgument])
            props.onNextUserChange(nextUser);
            handleUpdateRound();
        }
	};

    const handleUpdateArgument = (argument) => {
		const newArguments = closedMessages.map((a) => (a.id === argument.id ? argument : a));
        setClosedMessages(newArguments);
	};

    const handleDeleteArgument = (argument) => {
		const newArguments = closedMessages.filter((a) => a.id !== argument.id);
        setClosedMessages(newArguments);
	};

    const displayHeader = (round) => {
        return (
            <div className={cx(styles.headerContainer, {[styles.nextRoundHeader]: round > props.currentRound, [styles.unstartedDuelHeader]: props.currentRound == 0 && round == 1})}>
                <div>
                    {displayRoundTitle(round)}
                </div>
                { props.currentRound == 0 && round == 1 && !props.debate.expired &&
                    <div className={styles.nextUserContainer}>
                        { props.nextUser && props.nextUser.id ?
                            <>
                                {displayImage(props.nextUser && props.nextUser.id)}
                                <span>
                                    <FormattedMessage id={"info.duel_user_round"} />
                                </span>
                            </>
                        :
                            <span>
                                <FormattedMessage id={"closed_group.user_empty"} />
                            </span>
                        }
                    </div>
                }
                { props.currentRound == round && !props.debate.expired &&
                    <div className={styles.nextUserContainer}>
                        { props.nextUser && props.nextUser.id ?
                            <>
                                {displayImage(props.nextUser && props.nextUser.id)}
                                <span><FormattedMessage id={"info.duel_user_round"} /></span>
                            </>
                        :
                            <span><FormattedMessage id={"closed_group.user_empty"} /></span>
                        }
                    </div>
                }
            </div>
        );    
    }

    const displayRoundTitle = (round) => {
        return (
            <>
                {round == 1 && 
                    <>
                        <span><FormattedMessage id={"info.duel_first_round"} /></span> 
                        {props.currentRound == round && !props.debate.expired &&
                            <span className={styles.timeRemaining}>- {relativeTime}</span>
                        }
                    </>
                }
                {round == 2 &&
                    <> 
                        <span><FormattedMessage id={"info.duel_second_round"} /></span> 
                        {props.currentRound == round && !props.debate.expired &&
                            <span className={styles.timeRemaining}>- {relativeTime}</span>
                        }
                    </>
                }
                {round == 3 && 
                    <>
                        <span><FormattedMessage id={"info.duel_third_round"} /></span>
                        {props.currentRound == round && !props.debate.expired &&
                            <span className={styles.timeRemaining}>- {relativeTime}</span>
                        }
                        </>
                    }
                {round == 4 && 
                    <>
                        <span><FormattedMessage id={"info.duel_fourth_round"} /></span>
                        {props.currentRound == round && !props.debate.expired &&
                            <span className={styles.timeRemaining}>- {relativeTime}</span>
                        }
                        </>
                }
                {round == 5 && 
                    <>
                        <span><FormattedMessage id={"info.duel_fifth_round"} /></span>
                        {props.currentRound == round && !props.debate.expired &&
                            <span className={styles.timeRemaining}>- {relativeTime}</span>
                        }
                    </>
                }
            </>
        );
    }

    const displayArgument = (message) => {
        return (
            message && (message.status == "accepted" || currentUser.id == message.author.id) ?
                <div className={styles.messageBox}>
                    <Argument
                        positionIndex={props.debate.group_context.positions.map((e) => e.id).indexOf(message.position.id) + 1}
                        debateIsActive={true}
                        debatePositions={props.debate.group_context.positions}
                        debateSlug={props.debate.slug}
                        argument={message}
                        key={message.id}
                        expandable={true}
						debateGroupContext={props.debate.group_context}
                        debateName={props.debate.group_context.name}
                    />
                </div>
            :
                <div className={cx(styles.messageBox, styles.textInformation)}>
                    <>
                        { message == null &&
                            <span>
                                <FormattedMessage id='info.duel_message_deleted' />
                            </span>
                        }
                        { message && message.status == "pending" &&
                            <span>
                                <FormattedMessage id='info.duel_message_pending' />
                            </span>
                        }
                        { message && message.status == "rejected" &&
                            <span>
                                <FormattedMessage id='info.duel_message_rejected' />
                            </span>
                        }
                    </>
                </div>
        )
    }

    const displayNextUserArgument = (textKey) => {
        let nextUserObject = props.nextUser ? props.debate.debate_members.find(member => member.user.id === props.nextUser.id) : undefined;
        let positionIndex = nextUserObject ? props.debate.group_context.positions.findIndex(position => position.id === nextUserObject.position.id) : undefined;
        return (
            <div className={cx(styles.messageBox, styles.closedArgumentBlankContainer)}>
                <ChallengeArgumentBlankBox
                    nextUser={nextUserObject}
                    positionIndex={positionIndex}
                    textKey={textKey}
				/>
            </div>
        )
    }

    const displayArgumentInput = () => {
        return (
            <div className={cx(styles.messageBox, styles.inputContainer)}>
                <Suspense fallback={null}>
                    <ArgumentInput 
                        groupType={"Debate"}
                        onAddArgument={() => null}
                        disabled={false}
                        debateSlug={props.debate.slug} 
                        debateId={props.debate.id}
                        debateName={props.debate.group_context.name}
                        debatePositions={props.debate.group_context.positions}
                        showAlert={true}
                        argumentPositionId={props.debate.debate_members.filter(member => member.user.id === currentUser.id)[0].position.id}
                    />
                </Suspense>
            </div>
        )
    }

    const displayArguments = (round) => {
        let last_message_author_id = props.debate.users.length == 2 && props.debate.users[1];
        let messages = [];
        closedMessages.forEach( message => {
            if(last_message_author_id == message.author.id) {
                messages.push(null);
            }
            messages.push(message);
            last_message_author_id = message.author.id;
        })
        // Current loop messages
        messages = messages.slice((round - 1) * 2, (round - 1) * 2 + 2);
        return (
            <> 
                { props.currentRound - 1 == round && messages.length < 2 ? 
                        [...messages, null].map(m => displayArgument(m)) 
                    :
                        messages.map(m => displayArgument(m))
                }
                { props.currentRound == 0 && messages.length < 2 && round == 1 &&
                    <>
                        {props.nextUser && props.nextUser.id === currentUser.id ?
                            displayArgumentInput()
                        :
                            displayNextUserArgument()
                        }
                    </>
                }
                { props.currentRound == round && messages.length < 2 && !props.debate.expired &&
                    <>
                        {props.nextUser && props.nextUser.id === currentUser.id ?
                            displayArgumentInput()
                        :
                            displayNextUserArgument()
                        }
                    </>
                }
                { props.currentRound == round && (messages.length === 2 || messages.length === 0) && props.debate.expired &&
                    <div className={styles.emptyRoundContainer}><span><FormattedMessage id="info.duel_ended" /></span></div>
                }
                { props.currentRound == round && messages.length === 1 && props.debate.expired &&
                    displayNextUserArgument("challenge.user.given_up")
                }
                { props.currentRound + 1 == round && messages.length === 0 &&
                    <div className={styles.emptyRoundContainer}><span><FormattedMessage id={props.debate.expired ? "info.duel_ended" : "challenge.empty_round"} /></span></div>
                }
                { props.currentRound + 2 == round && messages.length === 0 &&
                    <div className={styles.emptyRoundContainer}><span><FormattedMessage id={props.debate.expired ? "info.duel_ended" : "challenge.empty_round"} /></span></div>
                }
            </>
        )
    }

    const displayRound = (round) => {
        return (
            <div className={styles.roundContainer}>
                { displayHeader(round) }
                <div className={styles.messagesContainer}>
                    { displayArguments(round) }
                </div>
            </div>
        )
    }

    return (
        <>
            {isLoading === false ?
                <VoteProvider>
                    <div className={styles.messageListContainer}>
                        { [...Array(props.debate.number_rounds).keys()].map(round => displayRound(round + 1)) }
                    </div>
                    {(props.debate.current_phase === "vote" || props.debate.current_phase === "finished") &&
                        <div className={styles.footerContainer}>
                            <span className={styles.footerText}><FormattedMessage id="info.duel_finished" /></span>
                        </div>
                    }
                </VoteProvider>
            :
                <Loader />
            } 
        </>
    );
}

export default withRouter(ChallengeBody);
