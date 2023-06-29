import React, { useMemo } from "react";
import { PaginatedList } from "@logora/debate.list.paginated_list";
import ChallengeBannerBox from "./ChallengeBannerBox";
import ChallengeBlankBox from "./ChallengeBlankBox";
import BoxSkeleton from '@logora/debate.skeleton.box_skeleton';

const ChallengeBanner = () => {
    const seed = useMemo(() => Math.random(), []);

    return (
        <PaginatedList
            currentListId={"challengeBannerList"}
            resource={"debates"}
            resourcePropName="debate"
            filters={ { "is_started": true, "random": seed, "expired": false } }
            sort={"-created_at"}
            perPage={1}
            withPagination={false}
            searchBar={false}
            display={"column"}
            loadingComponent={<BoxSkeleton />}
            emptyListComponent={<ChallengeBlankBox />}
        >
            <ChallengeBannerBox />
        </PaginatedList>
    )
}

export default ChallengeBanner;