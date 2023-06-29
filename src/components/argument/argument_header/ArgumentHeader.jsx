import React from "react";
import { useRelativeTime } from "@logora/debate.hooks.use_relative_time";
import { AuthorBox } from '@logora/debate.user.author_box';
import { AuthorBoxSmall } from '@logora/debate.user.author_box_small';
import cx from "classnames";
import styles from "./ArgumentHeader.module.scss";

export const ArgumentHeader = ({ author, tag, tagClassName, date, hideDate = false, oneLine = false, disableLinks = false}) => {
	const relativeTime = useRelativeTime(new Date(date).getTime());

	return (
		<div className={styles.argumentHeader}>
			<div className={styles.argumentHeaderAuthorBox}>
				{ oneLine === true ?
					<AuthorBoxSmall author={author} />
				:
					<AuthorBox author={author} disableLinks={disableLinks} />
				}
			</div>
			<div className={styles.argumentHeaderRight}>
				{ tag &&
					<div className={cx(styles.argumentHeaderTagBox, tagClassName)}>
						<div className={styles.argumentHeaderTag} title={tag}>
							{ tag }
						</div>
					</div>
				}
				{ !date || hideDate || oneLine ? null :
					<div data-testid={"argument-header-date"} className={cx(styles.argumentHeaderDate)}>
						{ relativeTime }
					</div>
				}	
			</div>
		</div>
	);
}