import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { useAuth } from "@logora/debate.auth.use_auth";
import { useModal } from '@logora/debate.dialog.modal';
import { useAuthenticationRequired } from "@logora/debate.hooks.use_authentication_required";
import { useReportContent } from './useReportContent';

jest.mock('@logora/debate.auth.use_auth');
jest.mock('@logora/debate.dialog.modal');
jest.mock('@logora/debate.hooks.use_authentication_required');

describe('useReportContent', () => {
    beforeEach(() => {
        useAuth.mockReturnValue({ isLoggedIn: true });
        useModal.mockReturnValue({ showModal: jest.fn() });
        useAuthenticationRequired.mockReturnValue([jest.fn()]);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should show ReportModal if user is logged in', async () => {
        const reportableType = 'post';
        const reportableId = '123';
        const modalTitle = 'Report Post';
        const { reportContent } = useReportContent(reportableType, reportableId, modalTitle);

        const { getByText } = render(<button onClick={reportContent}>Report</button>);

        fireEvent.click(getByText('Report'));

        expect(useModal().showModal).toHaveBeenCalled();
    });
});
