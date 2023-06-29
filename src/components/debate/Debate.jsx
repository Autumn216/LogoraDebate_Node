import React, { Suspense, lazy, useEffect, useState } from 'react';
import { withLoading } from '@logora/debate.tools.with_loading';
import { useConfig } from '@logora/debate.context.config_provider';
import { useDataProvider } from '@logora/debate.data.data_provider';
import { useResponsive } from "@logora/debate.hooks.use_responsive";
import { useRouteMatch } from "react-router";
import { useIntl, FormattedMessage } from 'react-intl';
import { Helmet } from "react-helmet";
import { DebateRelatedList } from '@logora/debate.debate.debate_related_list';
import DebateContext from "./DebateContext";
import DebateBody from "./DebateBody";
import BackLink from '@logora/debate.action.back_link';
const SuggestionsBanner = lazy(() => import('../SuggestionsBanner'));
const ChallengeBanner = lazy(() => import('../challenge/ChallengeBanner'));
import { ContextSourceList } from '@logora/debate.source.context_source_list';
import styles from './Debate.module.scss';

const Debate = (props) => {
    const [debate, setDebate] = useState(props.staticContext && props.staticContext.getDebate || {});
    const [loadError, setLoadError] = useState(false);
    const match = useRouteMatch();
    const config = useConfig();
    const intl= useIntl();
    const api = useDataProvider();
    const [isMobile, isTablet, isDesktop] = useResponsive();

    useEffect(() => {
        props.setIsLoading(true);
        loadDebate(match.params.debateSlug);
    }, [match.params.debateSlug])

    const loadDebate = (debateSlug) => {
        api.getOne("groups", debateSlug, {}).then(
            response => {
                const debate = response.data.data.resource;
                dispatchLoadEvent(debate);
                setDebate(debate);
                props.setIsLoading(false);
            }).catch(error => {
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
                                    <title>{debate.group_context.name + " - " + config.provider.name}</title>
                                    <meta name="description" content={intl.formatMessage({ id: "metadata.debate_description" }, { debate_title: debate.group_context.name }) } />
                                    <meta property="og:title" content={debate.group_context.name } />
                                    <meta property="og:description" content={intl.formatMessage({ id: "metadata.debate_description" }, { debate_title: debate.group_context.name }) } />
                                    <meta property="og:type" content="article" />
                                    <meta property="og:image" content={debate.image_url} />
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
                                                "@type": "Article",
                                                "dateCreated": "${debate.created_at}",
                                                "datePublished": "${debate.created_at}",
                                                "headline": "${debate.group_context.name.replace(/\"/g, '\\"')}",
                                                "image": "${debate.image_url}",
                                                "commentCount": "${debate.messages_count}",
                                                "description": "${intl.formatMessage({ id: "metadata.debate_description" }, { debate_title: debate.group_context.name }).replace(/\"/g, '\\"')}",
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
                            <>
                                { (debate.source?.length > 0 && debate.source[0] && debate.source[0].source_url) ? (
                                    <BackLink className={styles.backLink} data-tid={"link_back_source"} link={debate.source[0].source_url} text={config.layout.backToArticleText ? config.layout.backToArticleText : <FormattedMessage id="action.back_to_synthesis" defaultMessage={"Back to article"}/>} />
                                ) : (
                                    <div className={styles.debateSpacer}></div>
                                )}
                            </>
                            <>
                                { debate.image_url && isMobile && config.layout.showDebateImage === true &&(
                                    <div className={styles.debateImageBox}>
                                        <img loading={"lazy"} className={styles.debateImage} src={debate.image_url} />
                                    </div>
                                )}
                            </>
                            <DebateContext debate={debate} />
                            { debate.group_context?.context_sources?.length > 0 && <ContextSourceList sources={debate.group_context.context_sources} /> }
                            <DebateBody debate={debate} staticContext={props.staticContext} />
                            { (config.modules.suggestions?.active === false) || (props.staticContext && "getDebate" in props.staticContext) ?
                                null
                                :
                                <Suspense fallback={null}>
                                    <SuggestionsBanner />
                                </Suspense>
                            }
                            { config.modules.challenges && !(props.staticContext && "getDebate" in props.staticContext) && (
                                <Suspense fallback={null}>
                                    <ChallengeBanner /> 
                                </Suspense>
                            )}
                            <DebateRelatedList debateSlug={debate.slug} staticContext={props.staticContext} />
                        </div>
                    </div>
                </>
            ) : null}
        </>
    );
}

export default withLoading(Debate);
