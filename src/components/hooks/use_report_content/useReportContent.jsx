import React, { lazy, Suspense } from 'react';
import { useAuth } from "@logora/debate.auth.use_auth";
import { useModal } from '@logora/debate.dialog.modal';
import { useAuthenticationRequired } from "@logora/debate.hooks.use_authentication_required";
const ReportModal = lazy(() => import(/* webpackPrefetch: true */ '@logora/debate.report.report_modal'));

export const useReportContent = (reportableType, reportableId, modalTitle) => {
    const { isLoggedIn } = useAuth();
    const { showModal } = useModal();
	const requireAuthentication = useAuthenticationRequired();

    const reportContent = () => {
		if (isLoggedIn) {
			showModal(
				<Suspense fallback={null}>
					<ReportModal 
						reportableType={reportableType}
						reportableId={reportableId}
						title={modalTitle}
					/>
				</Suspense>
			);
		} else {
			requireAuthentication();
		}
	};

    return { reportContent };
}