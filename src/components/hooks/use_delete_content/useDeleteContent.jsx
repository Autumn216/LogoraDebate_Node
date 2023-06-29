import React from 'react';
import { useAuth } from "@logora/debate.auth.use_auth";
import { useModal } from '@logora/debate.dialog.modal';
import { useIntl } from 'react-intl';
import { useList } from '@logora/debate.list.list_provider';
import { useDataProvider } from '@logora/debate.data.data_provider';
import { ConfirmModal } from '@logora/debate.modal.confirm_modal';
import { useAuthenticationRequired } from "@logora/debate.hooks.use_authentication_required";

export const useDeleteContent = (content, contentType, listId, deleteTitle, deleteQuestion, deleteAlert) => {
	const intl = useIntl();
    const { isLoggedIn } = useAuth();
    const list = useList();
    const api = useDataProvider();
    const { showModal } = useModal();
	const requireAuthentication = useAuthenticationRequired();

    const deleteContent = () => {
        if (isLoggedIn) {
			showModal(
                <ConfirmModal
					title={deleteTitle}
					question={deleteQuestion}
					confirmLabel={intl.formatMessage({ id: "info.yes" })}
					cancelLabel={intl.formatMessage({id: "info.no" })}
					onConfirmCallback={() => confirmDelete()}
				/>
			);
		} else {
			requireAuthentication();
		}
    }

	const confirmDelete = () => {
        list.remove(listId, [content]);
        //props.toastAlert(deleteAlert, "success", "", "", "");
		api.delete(contentType, content.id).then((response) => {
			if (response.data.success) {
				// NOTHING
			}
		});
	};

    return { deleteContent };
}