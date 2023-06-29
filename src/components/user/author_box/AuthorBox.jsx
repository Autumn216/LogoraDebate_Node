import React from 'react';
import { useRoutes } from '@logora/debate.context.config_provider';
import { useIntl } from 'react-intl';
import { Avatar } from '@logora/debate.user.avatar';
import { PointIcon } from '@logora/debate.icons';
import { Link } from '@logora/debate.action.link';
import styles from './AuthorBox.module.scss';

export const AuthorBox = ({ author, disableLinks, hideUserInfo, showDescription }) => {
    const intl = useIntl();
    const routes = useRoutes();
    const isOnline = (new Date(author.last_activity) > Date.now());

    return (
        <div className={styles.authorBox}>
            { disableLinks || !author.slug ?
                <Avatar data-tid={"action_view_argument_author_image"} avatarUrl={author.image_url} userName={author.full_name} isOnline={isOnline} />
            :
                <Link to={routes.userShowLocation.toUrl({userSlug: author.slug})} className={styles.authorLink}>
                    <Avatar data-tid={"action_view_argument_author_image"} avatarUrl={author.image_url} userName={author.full_name} isOnline={isOnline} />
                </Link>
            }
            { hideUserInfo !== true &&
                <div className={styles.authorNameBox}>
                    <div className={styles.authorName}>
                        { disableLinks || !author.slug ?
                            <span>
                                {author.full_name}
                            </span>
                        :
                            <div className={styles.authorNameLine}>
                                <div className={styles.authorLink}>
                                    <Link data-tid={"action_view_argument_author_name"} to={routes.userShowLocation.toUrl({userSlug: author.slug})}>
                                        { author.full_name } 
                                    </Link>
                                </div>
                            </div>
                        }
                    </div>
                    <div className={styles.authorPointsBox}>
                        { showDescription ?
                            <>
                                { author.description }
                            </>
                        :  
                            <>
                                <div className={styles.authorPoints}>
                                    <span>{author.points ? intl.formatNumber(author.points, { notation: 'compact', maximumFractionDigits: 1, roundingMode: "floor" }) : "0"}</span>
                                    <PointIcon width={15} height={15} />
                                </div>
                                { author.eloquence_title &&
                                    <div className={styles.authorPoints}>
                                        <span>{ intl.formatMessage({ id: "badge." + author.eloquence_title + ".reward", defaultMessage: "Eloquence title" }) }</span>
                                    </div>
                                }
                            </>
                        }
                    </div>
                    { author.occupation &&
                        <div className={styles.occupationBox}>
                            <span className={styles.authorPoints}>
                                { author.occupation }
                            </span>
                        </div>
                    }
                </div>
            }
        </div>
    )
}