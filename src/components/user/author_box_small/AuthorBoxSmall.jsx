import React from "react";
import { useRoutes } from '@logora/debate.context.config_provider';
import { Link } from '@logora/debate.action.link';
import { Avatar } from '@logora/debate.user.avatar';
import styles from "./AuthorBoxSmall.module.scss";

export const AuthorBoxSmall = (props) => {
    const routes = useRoutes();

    return (
        <div className={styles.authorContainer}>
            <Link to={routes.userShowLocation.toUrl({userSlug: props.author?.slug})} className={styles.authorLink} target="_top">
                <Avatar avatarUrl={props.author.image_url} userName={props.author.full_name} size={25} />
            </Link>
            <div className={styles.authorName}>
                <Link to={routes.userShowLocation.toUrl({userSlug: props.author?.slug})} className={styles.authorLink} target="_top">
                    { props.author.full_name }
                </Link>
            </div>
        </div>
    )
}