import React from 'react';
import { screen, render } from '@testing-library/react';
import { SourcePreview } from './SourcePreview';

const SOURCE = { publisher: 'Publisher', title: 'Title', description: "Description" };

it('should render a source preview with the correct text', () => {
	const sourcePreview = render(<SourcePreview source={SOURCE} />);
    const renderedSourcePreviewPublisher = sourcePreview.getByText(/Publisher/i);
	const renderedSourcePreviewTitle = sourcePreview.getByText(/Title/i);
    const renderedSourcePreviewDesc = sourcePreview.getByText(/Desc/i);
    
	expect(renderedSourcePreviewPublisher).toBeTruthy();
    expect(renderedSourcePreviewTitle).toBeTruthy();
    expect(renderedSourcePreviewDesc).toBeTruthy();
});

it('should render a loader when props is true', () => {
	const sourcePreview = render(<SourcePreview source={SOURCE} showLoader={true} />);
    expect(screen.getByRole("status")).toBeTruthy()
});
