import React from 'react';
import { render } from '@testing-library/react';
import { ContextSourceBox } from './ContextSourceBox';
import { IntlProvider } from 'react-intl';

it('should render with the correct text', () => {
	const box = render(
        <IntlProvider locale="en">
            <ContextSourceBox 
                imageUrl="https://example.com/image.jpg"
                author="Logora"
                date="2022-07-19T13:56:53.809Z"
                title="An interesting article about cats" 
            />
        </IntlProvider>
	);
	const renderedBox = box.getByText(/An interesting article about cats/i);
	const renderedDate = box.getByText(/July 19, 2022/i);
	expect(renderedBox).toBeTruthy();
	expect(renderedDate).toBeTruthy();
});