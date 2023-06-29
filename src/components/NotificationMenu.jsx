import React, { useState } from "react";
import { useDataProvider } from '@logora/debate.data.data_provider';
import { useIntl } from "react-intl";
import { PaginatedList } from "@logora/debate.list.paginated_list";
import Notification from "./Notification";
import UserContentSkeleton from '@logora/debate.skeleton.user_content_skeleton';
import styles from "./NotificationMenu.module.scss";

const NotificationMenu = (props) => {
	const intl = useIntl();
	const api = useDataProvider();
	const [readAll, setReadAll] = useState(false);

	const handleClick = () => {
		setReadAll(true);
		api.create("notifications/read/all", {}).then((response) => {});
	};

	const handleKeyDown = (event, method) => {
		const ENTER_KEY = 13;
		if (event.keyCode == ENTER_KEY) {
			if (method === "readAllNotifications") {
				handleClick();
			}
		}
	};

	return (
		<>
			<div className={styles.notificationMenuHeader}>
				<div className={styles.notificationMenuHeaderText}>
					{ intl.formatMessage({ id: 'header.notifications' }) }
				</div>
				<div
					id='read_all_notifications'
					data-tid={"action_read_all_notifications"}
					className={styles.readNotificationsButton}
					tabIndex='0'
					onKeyDown={(event) => handleKeyDown(event, "readAllNotifications")}
					onClick={handleClick}
				>
					{ intl.formatMessage({ id: 'notifications.read_all' }) }
				</div>
			</div>
			<div className={styles.notificationList}>
				<PaginatedList 
					currentListId={"notificationList"}
					loadingComponent={<UserContentSkeleton hideBody />}
					resourcePropName="notification"
					resource={'notifications'} 
					sort={"-created_at"}
					perPage={10}
					withToken={true}
					display={"column"}
					onElementClick={props.toggle}
					gap={"0px"}
				>
					<Notification onNotificationClick={props.toggle} isOpen={readAll} />
				</PaginatedList>
			</div>
		</>
	);
}

export default NotificationMenu;