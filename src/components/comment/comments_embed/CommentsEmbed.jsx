import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { useConfig, useRoutes } from '@logora/debate.context.config_provider';
import { Link } from '@logora/debate.action.link';
import { ArgumentHeader } from '@logora/debate.argument.argument_header';
import { ReadMore } from '@logora/debate.text.read_more';
import styles from './CommentsEmbed.module.scss';

export const CommentsEmbed = ({ source }) => {
    const { uid, comments_count = 0, online_users_count = 0, top_comments = [] } = source;
    const config = useConfig();
    const routes = useRoutes();
	const commentLink = routes.commentShowLocation.toUrl({ articleUid: uid });

	return (
		<>
			{ top_comments.length > 0 && config?.comments?.showTopComments === true ? 
				<>
					<div className={styles.header}>
						<div className={styles.totalComments}>
							<FormattedMessage id={"comment.comments_embed.total_comments"} values={{count: comments_count}} defaultMessage={"{count} comments"} />
						</div>
						{ online_users_count &&
							<div className={styles.headerLiveStat}>
								<div className={styles.headerLiveNow}></div>
								<span className={styles.headerLivePin}>
									<FormattedMessage id={"comment.comments_embed.online_users"} values={{count: online_users_count}} defaultMessage={"{count} online users"} />
								</span>
								<span className={styles.headerLivePinMobile}>
									<FormattedMessage id={"comment.comments_embed.online"} values={{ count: online_users_count }} defaultMessage={"{count} online"} />
								</span>
							</div>
						}
					</div>
					{ top_comments.map(comment =>
						<div key={comment.id} data-testid={"comment-box"} className={styles.commentBox}>
							<ArgumentHeader
								author={comment.author}
								date={comment.created_at}
							/>
							<div className={styles.commentContent}>
								<ReadMore 
									content={comment.content}
									contentCharCount={200}
									to={commentLink + "#argument_" + comment.id} 
									className={styles.readMoreLink}
									data-tid={"link_comment_read_more"}
									target="_top"
									external
									readMoreText={<FormattedMessage id="comment.comments_embed.read_more" defaultMessage={"Read more"} />}
								/>
							</div>
						</div>
					)}
					<div className={styles.footer}>
						<Link to={commentLink} target="_top" external>
							<div className={styles.callToAction}>
                                <FormattedMessage id="comment.comments_embed.call_to_action" values={{ count: comments_count }} defaultMessage={"Read {count} comments"} />
							</div>
						</Link>
					</div>
				</>
			:
				<div className={styles.footerOneLine}>
					<Link to={commentLink} target="_top" external>
						<span className={styles.commentsSynthesisBoxLink}>
							<FormattedMessage id="comment.comments_embed.title" defaultMessage={"Give your opinion on this article"} />
						</span>
					</Link>
					<Link to={commentLink} target="_top" external>
						<div className={styles.callToAction}>
                            <FormattedMessage id="comment.comments_embed.call_to_action" values={{ count: comments_count }} defaultMessage={"Read {count} comments"} />
						</div>
					</Link>
				</div>
			}
		</>
	)
}

CommentsEmbed.propTypes = {
	/** source object containing uid, comments_count, online_users_count and top_comments */
	source: PropTypes.shape({
        uid: PropTypes.string,
        comments_count: PropTypes.number,
        online_users_count: PropTypes.number,
        top_comments: PropTypes.arrayOf(PropTypes.shape({
            id: PropTypes.number,
            created_at: PropTypes.instanceOf(Date),
            author: PropTypes.object,
            content: PropTypes.string
        }))
    }),   
};