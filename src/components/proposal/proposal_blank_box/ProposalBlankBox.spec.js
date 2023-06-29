import React from 'react';
import { render } from '@testing-library/react';
import { DefaultProposalBlankBox } from './ProposalBlankBox.composition';

it('should render box with correct test id', () => {
	const container = render(
        <DefaultProposalBlankBox />
	);
    
    expect(container.getByText("Add proposal")).toBeTruthy();
    const link = container.getByRole("link");
    expect(link.tagName).toBe("A");
    expect(link.href).toBe("https://example.com/");
});