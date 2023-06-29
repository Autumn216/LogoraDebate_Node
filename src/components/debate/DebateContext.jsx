import React from 'react';
import { useRoutes, useConfig } from '@logora/debate.context.config_provider';
import { useIntl, FormattedDate } from 'react-intl';
import { ChatIcon, VoteboxIcon } from '@logora/debate.icons';
import { Tooltip } from '@logora/debate.tools.tooltip';
import { ShareButton } from '@logora/debate.share.share_button';
import { Tag } from '@logora/debate.tag.tag';
import { Link } from 'react-router-dom';
import { useResponsive } from "@logora/debate.hooks.use_responsive";
import VoteBox from '../VoteBox';
import { FollowButton } from '@logora/debate.follow.follow_button';
import styles from './DebateContext.module.scss';
import cx from 'classnames';

const DebateContext = (props) => {
    const intl = useIntl();
    const routes = useRoutes();
    const config = useConfig();
    const [isMobile, isTablet, isDesktop] = useResponsive();

    const displayTag = (tag, index) => {
        return (
            <div className={styles.tagItem} key={index}>
                <Link className={styles.tagLink} data-tid={"action_search_debate_tag"} to={{ pathname: routes.searchLocation.toUrl(), search: `?q=${tag.display_name}` }} >
                    <Tag dataTid={"action_search_debate_tag"} text={tag.display_name} />
                </Link>
            </div>
        );
    }

    return (
        <div className={cx(styles.debateContext, { [styles.isMobile]: isMobile && config.layout.showDebateImage === true })}>
            <div className={styles.debateTitleBox}>
                <div className={styles.debateSubtitleBox}>
                    <div className={styles.debateDate}>
                        <FormattedDate
                            value={new Date(props.debate.created_at)}
                            year="numeric"
                            month="long"
                            day="2-digit"
                        />
                    </div>
                </div>
                <div className={styles.debateTitle}>{ props.debate.group_context.name }</div>
                { props.debate.group_context.author && props.debate.group_context.author.is_admin === false &&
                    <div className={styles.debateSuggestion}>
                        <span>{ intl.formatMessage({ id: "suggestion.author" }) }</span>
                        <Link to={routes.userShowLocation.toUrl({userSlug: props.debate.group_context.author.slug})} className={styles.userProfilLink}>
                            <img data-tid={"action_view_argument_author_image"} loading={"lazy"} className={styles.authorImage} src={props.debate.group_context.author.image_url} alt={intl.formatMessage({ id:"alt.profile_picture" }) + `${props.debate.group_context.author.full_name}`} height="22" width="22" />
                            <span className={styles.authorName}>{props.debate.group_context.author.full_name}</span>
                        </Link>
                    </div>
                }
                { props.debate.group_context.tags && props.debate.group_context.tags.length > 0 &&
                    <div className={styles.debateTagList}>
                        { props.debate.group_context.tags.slice(0, 3).map(displayTag) }
                    </div>
                }
                <div className={styles.debateNumbersBox}>
                    <Tooltip text={intl.formatMessage({ id:"info.participants_count"})}>
                        <div id="debateNumberParticipants" className={styles.debateNumberItem}>
                            <VoteboxIcon width={20} height={20} />
                            <div
                                className={styles.debateNumberContent}>{props.debate.votes_count.total ? props.debate.votes_count.total : 0}
                            </div>
                        </div>
                    </Tooltip>
                    <Tooltip text={intl.formatMessage({ id:"info.arguments_count" })}>
                        <div id="debateNumberArguments" className={styles.debateNumberItem}>
                            <ChatIcon width={17} height={17} {...(config.theme.iconTheme === "edge" && {variant: "edge"})} />
                            <div className={styles.debateNumberContent}>{props.debate.messages_count}</div>
                        </div>
                    </Tooltip>
                </div>
            </div>
            <div className={styles.debateVoteBox}>
                <div className={styles.debateVoteContainer}>
                    <VoteBox 
                        onAddVote={() => null}
                        debate={props.debate}
                        displayColumn={true}
                        voteableType={"Group"}
                        votePositions={props.debate.group_context.positions}
                    />
                </div>
                <div className={styles.debateActionsBox}>
                    <div className={styles.debateShareAction}>
                        <ShareButton 
                            shareUrl={"https://app.logora.fr/share/g/" + props.debate.id} 
                            shareTitle={intl.formatMessage({ id: "share.debate.title" })} 
                            shareText={intl.formatMessage({ id: "share.debate.text" })} 
                            showText 
                        />
                    </div>
                    <div className={styles.debateFollowAction}>
                        <FollowButton followableType={"group"} followableId={props.debate.id} tooltipText={intl.formatMessage({ id: "follow.follow_debate", defaultMessage: "Follow the debate activity and keep track of your contributions on your profile" })} dataTid={"action_follow_debate"} />
                    </div>
                </div>
            </div>
        </div>        
    );
}

export default DebateContext;
