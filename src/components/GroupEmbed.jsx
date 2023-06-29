import React from 'react';
import { withConfig } from '@logora/debate.context.config_provider';
import { useIntl } from 'react-intl';
import { withResponsive } from "@logora/debate.hooks.use_responsive";
import { buildPath } from '../config/routes';
import { EmbedHeader } from '@logora/debate.embed.embed_header';
import VoteBox from './VoteBox';
import TopArguments from './TopArguments';
import { AdUnit } from '@logora/debate.ad.ad_unit';
import cx from 'classnames';
import styles from './GroupEmbed.module.scss';

const GroupEmbed = (props) => {
    const intl = useIntl();

    const getDebateUrlWithSource = () => {
        const debateSlug = props.group.slug;
        if(debateSlug === undefined) {
            return "";
        }
        const debatePath = buildPath(props.config.routes, props.routes.debateShowLocation.toUrl({ debateSlug: debateSlug }));
        if (props.config.provider.url) {
            let debateUrl = new URL(debatePath, props.config.provider.url);
            if (props.config.analytics && props.config.analytics.disableCampaignTracking !== true) {
                debateUrl.searchParams.append("utm_source", "article");
                debateUrl.searchParams.append("utm_campaign", props.config.source && props.config.source.uid);
                debateUrl.searchParams.append("utm_content", debateSlug);
                debateUrl.searchParams.append("mtm_keyword", props.config.source && props.config.id != 191 && props.config.source.source_url);
                debateUrl.searchParams.append("mtm_cid", props.config.id);        
            }
            return debateUrl.href;
        } else {
            return debatePath;
        }
    }

    const displayColumn = () => {
        if(props.config.synthesis.newDesign || props.config.synthesis.hideArguments) {
            if (props.isMobile && props.group.group_context.positions.length === 2) {
                return false;
            }
            return true;
        } else {
            return false;
        }
    }

    return (
        <div className={styles.syntheseContainer} data-debate-id={props.group.id} data-vid={"view_synthesis_container"}>
            <div className={cx(styles.syntheseBody, { [styles.syntheseBodyNewDesign]: props.config.synthesis.newDesign || props.config.synthesis.hideArguments })}>
                <EmbedHeader 
                    title={props.group.group_context.name} 
                    titleRedirectUrl={getDebateUrlWithSource()} 
                    onlineUsersCount={props.group.online_users_count} 
                    headerLabel={intl.formatMessage({ id: "header.synthesis_title" })} 
                    textLeft={props.config.synthesis.newDesign || props.config.synthesis.hideArguments} 
                />
                <div className={cx({ [styles.syntheseContentNewDesign]: props.config.synthesis.newDesign, [styles.syntheseContent]: props.config.synthesis.newDesign })}>
                    <div className={cx({[styles.syntheseVote]: props.config.synthesis.newDesign, [styles.syntheseVoteFullWidth]: props.config.synthesis.hideArguments || props.group.resourceName && props.group.resourceName === "vote_embed", [styles.votesRow]: (props.config.synthesis.newDesign === true || props.config.synthesis.hideArguments === true ? false : true)})}>
                            <VoteBox 
                                voteableType={"Group"} 
                                votePositions={props.group.group_context.positions}
                                redirectAfterVote={true}
                                onAddVote={() => null} 
                                displayColumn={displayColumn()}
                                debate={props.group}
                                onlyTwoThesis={props.config.synthesis.newDesign || props.config.synthesis.hideArguments ? false : true}
                                showBorder={props.config.synthesis.newDesign === true || props.config.synthesis.hideArguments === true ? false : true}
                                paddingLeft={props.config.synthesis.newDesign || props.config.synthesis.hideArguments ? true : false}
                                paddingRight={props.config.synthesis.hideArguments ? true : false}
                                noPadding={props.config.synthesis.newDesign ? true : false}
                                fullWidthButton={props.config.synthesis.newDesign || props.config.synthesis.hideArguments ? true : false}
                                smallShowResult={props.config.synthesis.newDesign || props.config.synthesis.hideArguments ? true : false}
                                spaceBetweenButton={props.isMobile && props.group.group_context.positions.length === 2}
                            />
                    </div>
                    { props.config.ads.display === true && props.config.ads.googleAdManager && ("article" in props.config.ads.googleAdManager) ?
                        <div className={styles.synthesisAd}>
                            <AdUnit type={"article"} sizes={[[300, 250], [300, 50]]} />
                        </div>
                    : null }
                    { !props.group.reduced_synthesis && (
                        (props.group.resourceName && props.group.resourceName === 'vote_embed' ?
                                null
                            :
                            <>
                                { (props.config.synthesis.hideTopArguments !== true) && (props.config.synthesis.hideArguments !== true) && (
                                    <div className={cx({[styles.syntheseTopArgument]: props.config.synthesis.newDesign})}>
                                        <TopArguments argumentFor={props.group.argument_for} argumentAgainst={props.group.argument_against} argumentCount={[props.group.first_position_argument_count, props.group.second_position_argument_count]} debate={props.group} debateUrl={getDebateUrlWithSource()} />
                                    </div>
                                )}
                            </>
                        )
                    )}
                </div>
                { (props.config.modules.drawer && props.config.insertType !== 'iframe') && <div id="logora_app"></div> }
            </div>
        </div>
    );
}

export default withResponsive(withConfig(GroupEmbed));
export { GroupEmbed as PureGroupEmbed };
