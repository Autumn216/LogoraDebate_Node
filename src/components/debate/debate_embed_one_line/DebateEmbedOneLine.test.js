import React from 'react';
import { render, screen } from '@testing-library/react';
import { DefaultDebateEmbedOneLine } from './DebateEmbedOneLine.composition';

describe('DebateEmbedOneLine', () => {
	test('should render the component without crashing', () => {
		render(<DefaultDebateEmbedOneLine />);
	});

	test('should show name and link to debate page', () => {
		render(<DefaultDebateEmbedOneLine />);
		
		expect(screen.getByText('Custom Debate')).toBeInTheDocument();
		expect(screen.getByText('Go to debate')).toBeInTheDocument();

		const link = screen.getByRole('link', { name: 'Go to debate' });
		expect(link).toHaveAttribute('href', 'espace-debat/debate/custom-slug');
	});
});