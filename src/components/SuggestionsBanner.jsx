import React, { useMemo } from "react";
import styles from "./SuggestionsBanner.module.scss";
import { LinkButton } from '@logora/debate.action.link_button';
import VotePaginatedList from "./VotePaginatedList";
import { ArrowIcon } from "@logora/debate.icons";
import { Link } from '@logora/debate.action.link';
import { withResponsive } from "@logora/debate.hooks.use_responsive";
import { withConfig } from '@logora/debate.context.config_provider';
import TextFormatter from "../utils/TextFormatter";
import cx from 'classnames';
import { SuggestionBlankBox } from "@logora/debate.suggestion.suggestion_blank_box";
import UserContentSkeleton from '@logora/debate.skeleton.user_content_skeleton';
import SuggestionBox from "./SuggestionBox";

const SuggestionsBanner = (props) => {
    const seed = useMemo(() => Math.random(), []);

    return (
        <div className={styles.suggestionsBannerContainer}>
            <div className={cx(styles.suggestionBannerContext, { [styles.isMobile]: props.isMobile })}>
                <div className={styles.suggestionsBannerTitle}>
                    <TextFormatter id="suggestion.banner_title" />
                </div>
                <div className={styles.suggestionsBannerDescription}>
                    <TextFormatter id="suggestion.banner_description" variables={{ variable: props.config.modules.suggestions && props.config.modules.suggestions.vote_goal || 30 }} />
                </div>
                <div className={styles.suggestionBannerButtonContainer}>
                    <LinkButton to={props.routes.suggestionLocation.toUrl()} data-tid={"action_suggestions_banner"} className={cx(styles.suggestionBannerButton, { [styles.isMobile]: props.isMobile })}>
                        <span className={styles.suggestionBannerButtonTitle}>
                            <TextFormatter id="suggestion.suggest" />
                        </span>
                        <span>
                            <ArrowIcon width={30} height={30} />
                        </span>
                    </LinkButton>
                    <Link data-tid={"action_suggestions_banner_view_more"} className={styles.suggestionBannerButtonInline} to={ props.routes.suggestionLocation.toUrl() }>
                        <TextFormatter id="suggestion.see_more" />
                    </Link>
                </div>
            </div>
            <div className={styles.suggestionBannerList}>
                <VotePaginatedList
                    voteableType={"DebateSuggestion"}
                    currentListId={"bannerSuggestionsList"}
                    resource={"debate_suggestions"}
                    resourcePropName="suggestion"
                    filters={ { "is_expired": false, "is_accepted": false, "status": "accepted", "is_admin": false, "random": seed } }
                    perPage={1}
                    withPagination={false}
                    searchBar={false}
                    display={"column"}
                    loadingComponent={<UserContentSkeleton />}
                    emptyListComponent={<SuggestionBlankBox />}
                >
                    <SuggestionBox />
                </VotePaginatedList>
            </div>
        </div>
    )
}

export default withConfig(withResponsive(SuggestionsBanner));