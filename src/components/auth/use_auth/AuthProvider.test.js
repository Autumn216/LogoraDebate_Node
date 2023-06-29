import React from 'react';
import { render } from '@testing-library/react';
import { AuthProvider } from './AuthProvider';
import { useAuth } from './useAuth';

const ComponentWithAuth = () => {
	const { isLoggedIn, isLoggingIn } = useAuth();

	return (
        <div>
            { isLoggingIn ? "is logging in" : "is not logging in" }
        </div>
    )
}

it('should render component with auth', () => {
	const container = render(
		<AuthProvider>
			<ComponentWithAuth />
		</AuthProvider>
	);

	expect(container.getByText(/is logging in/i)).toBeTruthy()
});