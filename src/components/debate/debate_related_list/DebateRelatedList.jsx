import React from 'react';
import { useConfig, useRoutes } from '@logora/debate.context.config_provider';
import { useIntl } from 'react-intl';
import { PaginatedList } from '@logora/debate.list.paginated_list';
import { LinkButton } from '@logora/debate.action.link_button';
import { DebateBox } from '@logora/debate.debate.debate_box';
import BoxSkeleton from '@logora/debate.skeleton.box_skeleton';
import styles from "./DebateRelatedList.module.scss";

export const DebateRelatedList = (props) => {
    const config = useConfig();
    const routes = useRoutes();
    const intl = useIntl();

    return (
        <div className={styles.debateRelatedBox} data-vid={"view_related_debates_container"}>
            <div className={styles.debateRelatedBoxHeader}>
                { intl.formatMessage({ id: "debate.debate_related_list.related_debates_title", defaultMessage: "Debates selected for you" }) }
            </div>
            <PaginatedList 
                currentListId={"debateRelatedList"}
                resource={props.latestDebates ? '/groups' : 'groups/' + props.debateSlug + '/related'} 
                sort={props.latestDebates ? "-created_at" : null}
                filters={config.modules.subApplications && {"by_sub_application": config.id} }
                loadingComponent={<BoxSkeleton />}
                resourcePropName={"debate"} 
                perPage={6}
                withPagination={false}
                countless={true}
                staticContext={props.staticContext}
                staticResourceName={"getRelatedDebates"}
            >
                <DebateBox displayAd={config.ads.display} />
            </PaginatedList>
            <div className={styles.seeMoreLink}>
                <LinkButton role="link" data-tid={"action_view_more_debates"} to={ routes.indexLocation.toUrl() }>
                    { intl.formatMessage({ id: "debate.debate_related_list.see_more_debate", defaultMessage: "See more debates" }) }
                </LinkButton>
            </div>
        </div>
    )
}
