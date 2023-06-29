import React, { useState, useEffect } from 'react';
import styles from './Challenge.module.scss';
import { useConfig } from '@logora/debate.context.config_provider';
import { withAuth } from "@logora/debate.auth.use_auth";
import { withLoading } from '@logora/debate.tools.with_loading';
import { useDataProvider } from '@logora/debate.data.data_provider';
import { withRouter } from "react-router";
import { useIntl } from 'react-intl';
import ChallengeContext from "./ChallengeContext";
import { Helmet } from "react-helmet";
import ChallengeBody from "./ChallengeBody";
import ChallengeRelatedList from "./ChallengeRelatedList";

const Challenge = (props) => {
    const config = useConfig();
    const api = useDataProvider();
    const [debate, setDebate] = useState(props.staticContext && props.staticContext.getChallenge || {});
    const [loadError, setLoadError] = useState(false);
    const [currentRound, setCurrentRound] = useState(undefined);
    const [currentPhase, setCurrentPhase] = useState(undefined);
    const [nextUser, setNextUser] = useState(undefined);
    const intl = useIntl();

    useEffect(() => {
        const { challengeSlug } = props.match.params;
        loadDebate(challengeSlug);
    }, [])

    useEffect(() => {
        props.setIsLoading(true);
        loadDebate(props.match.params.challengeSlug);
    }, [props.match.params.challengeSlug])

    useEffect(() => {
        if (props.location.state && props.location.state.refresh) {
            props.setIsLoading(true);
            loadDebate(props.match.params.challengeSlug);
        }
    }, [props.location.state])

    const handleUpdateNextUser = (nextUser) => {
        setNextUser(nextUser);
    }

    const handleCurrentRoundChange = (round) => {
        setCurrentRound(round);
    }

    const handleCurrentPhaseChange = (phase) => {
        setCurrentPhase(phase);
    }

    const loadDebate = (challengeSlug) => {
        api.getOne("debates", challengeSlug, {}).then(
            response => {
                if(response.data.success) {
                    const debate = response.data.data.resource;
                    dispatchLoadEvent(debate);
                    setDebate(debate);
                    setCurrentRound(debate.current_round);
                    setNextUser(debate.users.find(user => user.id === debate.next_user_id) || undefined);
                    setCurrentPhase(debate.current_phase);
                    props.setIsLoading(false);
                } else {
                    dispatchLoadEvent(null);
                    setLoadError(true);
                }
            }).catch(
            error => {
                dispatchLoadEvent(null);
                setLoadError(true);
            });
    }

    const dispatchLoadEvent = (debate) => {
        if(typeof window !== 'undefined') {
            window.dispatchEvent(
                new CustomEvent("logoraContentLoaded", {
                    detail: {
                        debate: debate
                    }
                })
            );
        }
    }

    if (loadError) {
        throw new Error(intl.formatMessage({ id:"error.debate" }) );
    }
    return (
        <>
            { props.isLoading === false ? (
                <>
                    <div className={styles.debateContainer} data-pid="debate">
                        <div id="debate" className={styles.debate}>
                            {config.isDrawer !== true &&
                                <Helmet>
                                    <title>{debate.group_context.name + " - " + config.provider.name }</title>
                                    <meta name="description" content={intl.formatMessage({ id: "metadata.challenge_description" }, { debate_title: debate.group_context.name }) } />
                                    <meta property="og:title" content={ debate.group_context.name } />
                                    <meta property="og:description" content={intl.formatMessage({ id: "metadata.challenge_description" }, { debate_title: debate.group_context.name }) } />
                                    <meta property="og:type" content="article" />
                                    <meta property="og:site_name" content={config.provider.name} />
                                    { (typeof window !== "undefined") &&
                                        <meta property="og:url" content={window.location.href.split(/[?#]/)[0]} />
                                    }
                                    { (typeof window !== "undefined") &&
                                        <link rel='canonical' href={window.location.href.split(/[?#]/)[0]} />
                                    }
                                    <script type="application/ld+json">
                                        {
                                            `{
                                                "@context": "https://schema.org",
                                                "@type": "Conversation",
                                                "dateCreated": "${debate.created_at}",
                                                "datePublished": "${debate.created_at}",
                                                "headline": "${debate.group_context.name}",
                                                "name": "${debate.group_context.name}",
                                                "commentCount": "${debate.messages_count}",
                                                "keywords": "${debate.group_context.tag_list.map(t => t)}",
                                                "provider": {
                                                    "@type": "Organization",
                                                    "name": "Logora",
                                                    "url": "https://logora.fr"
                                                }, 
                                                "mainEntityOfPage": {
                                                    "@type": "WebPage",
                                                    "@id": "${typeof window !== 'undefined' ? window.location.href.split(/[?#]/)[0] : null}"
                                                },
                                                "interactionStatistic": [
                                                    {
                                                        "@type": "InteractionCounter",
                                                        "interactionType": "http://schema.org/CommentAction",
                                                        "userInteractionCount": "${debate.messages_count}"
                                                    }
                                                ]
                                            }`
                                        }
                                    </script>
                                </Helmet>
                            }
                            <ChallengeContext 
                                debate={debate}
                                nextUser={nextUser}
                                currentPhase={currentPhase}
                                currentRound={currentRound}
                                staticContext={props.staticContext} 
                            />
                            <ChallengeBody 
                                debate={debate} 
                                currentRound={currentRound}
                                onCurrentRoundChange={handleCurrentRoundChange}
                                onCurrentPhaseChange={handleCurrentPhaseChange}
                                nextUser={nextUser}
                                onNextUserChange={handleUpdateNextUser}
                            />
                            <ChallengeRelatedList />
                        </div>
                    </div>
                </>
            ) : null}
        </>
    );
}

export default withRouter(withLoading(withAuth(Challenge)));
