import React from 'react';
import { render } from '@testing-library/react';
import { MatomoInitializer } from './MatomoInitializer';

it('should render without error', () => {
	const Container = (props) => {
		return (
			<>
				<MatomoInitializer matomoUrl={"mysite.com"} matomoContainerTag={"3R2zBYFH"} />
				<div>container</div>
			</>
		)
	}

	const container = render(
		<Container />
	);

	expect(container.getByText("container")).toBeTruthy();
});
