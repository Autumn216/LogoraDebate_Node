import React from 'react';
import { withConfig } from '@logora/debate.context.config_provider';
import { PaginatedList } from "@logora/debate.list.paginated_list";
import styles from "./ChallengeRelatedList.module.scss";
import { LinkButton } from '@logora/debate.action.link_button';
import { injectIntl } from 'react-intl';
import ChallengeBox from './ChallengeBox';
import BoxSkeleton from '@logora/debate.skeleton.box_skeleton';

const ChallengeRelatedList = (props) => {
    const { intl } = props;
    return (
        <div className={styles.challengeRelatedBox} data-vid={"view_related_debates_container"}>
            <div className={styles.challengeRelatedBoxHeader}>
                { intl.formatMessage({ id:"info.related_challenges" }) }
            </div>
            <PaginatedList 
                currentListId={"challengeRelatedList"}
                resource={'debates'}
				filters={ { "is_started": true, "expired": false } }
                sort={"-created_at"}
                loadingComponent={<BoxSkeleton />}
                resourcePropName={"debate"} 
                perPage={2}
                elementsPerLine={2}
                staticResourceName={"getRelatedChallenges"}
                withPagination={false}
            >
                <ChallengeBox />
            </PaginatedList>
            <div className={styles.seeMoreLink}>
                <LinkButton to={ props.routes.challengeIndexLocation.toUrl() }>
                    { intl.formatMessage({ id:"info.see_more_challenges" }) }
                </LinkButton>
            </div>
        </div>
    )
}

export default injectIntl(withConfig(ChallengeRelatedList));
