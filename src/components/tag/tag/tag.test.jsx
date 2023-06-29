import React from 'react';
import { render } from '@testing-library/react';
import { Tag } from './Tag';

it('should render with the correct text', () => {
	const tag = render(<Tag text="my-text" />);
	const renderedTag = tag.getByText(/my-text/i);
	expect(renderedTag).toBeTruthy();
});

