import React from "react";
import { useRoutes } from '@logora/debate.context.config_provider';
import { Link } from '@logora/debate.action.link'; 
import Argument from "./Argument";
import styles from "./CommentUserBox.module.scss";

const CommentUserBox = props => {
	const routes = useRoutes();
	const commentUrl = routes.commentShowLocation.toUrl({ articleUid: props.comment.group.uid }) + "/#argument_" + props.comment.id

	return (
		<div className={styles.commentUserBox}>
			<Link className={styles.commentUserBoxReplyAction} tabIndex='0' to={commentUrl}>
				<div className={styles.commentUserBoxHeader}>
					<div className={styles.commentTitleBox}>
						<div className={styles.commentUserBoxDebateTitle}>{props.comment.group.title}</div>
					</div>
				</div>
			</Link>
			<Argument
				argument={props.comment}
				debateName={props.comment.group.title}
				debateSlug={props.comment.group.uid}
				debateIsActive={true}
				isComment={true}
			/>
		</div>
	);
}

export default CommentUserBox;
