import React from 'react';
import { render, screen } from '@testing-library/react';
import { DefaultReportModal } from './ReportModal.composition';

it('should render modal with content and title', () => {
	const modal = render(
		<DefaultReportModal />
	);

	expect(screen.getByText("Report this argument")).toBeTruthy();
	expect(screen.getByRole('textbox')).toBeTruthy();
});