import React from "react";
import styles from "./PointTab.module.scss";
import { LogoraIcon } from '@logora/debate.icons';
import { PaginatedList } from "@logora/debate.list.paginated_list";
import TextFormatter from "../utils/TextFormatter";
import UserContentSkeleton from '@logora/debate.skeleton.user_content_skeleton';
import PointBox from "./PointBox";

const PointTab = (props) => {
    return (
        <div className={styles.container}>
            <div className={styles.title}>
                <LogoraIcon width={30} height={30} />
                <span><TextFormatter id="user.activity_list" /></span>
            </div>
            <div className={styles.content}>
                <span className={styles.score}><TextFormatter id="info.argument_score" /></span>
                <PaginatedList
                    currentListId={"userActivitiesList"}
                    sort={"-created_at"}
                    resource={"users/" + props.userSlug + "/activity"}
                    loadingComponent={<UserContentSkeleton hideBody />}
                    resourcePropName="activity"
                    display={"column"}
                    perPage={8}
                >
                    <PointBox />
                </PaginatedList>
            </div>
        </div>
    )
}

export default PointTab;