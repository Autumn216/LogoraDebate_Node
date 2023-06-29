import { withLoading } from "./withLoading";
import React from 'react';
import { render, screen, queryByRole } from '@testing-library/react';

it("should render the component without the loader when isLoading is false", () => {
    const MockComponent = () => <div>Mock Component</div>;
    const WrappedComponent = withLoading(MockComponent);
    const { getByText } = render(<WrappedComponent staticContext={true} />);
    const loader = screen.queryByRole("status");

    expect(getByText("Mock Component")).toBeInTheDocument();
    expect(loader).toBeFalsy();
});

it("should render the component with the loader when isLoading is true", () => {
    const MockComponent = () => <div>Mock Component</div>;
    const WrappedComponent = withLoading(MockComponent);
    const { getByText } = render(<WrappedComponent staticContext={false} />);
    const loader = screen.queryByRole("status");

    expect(getByText("Mock Component")).toBeInTheDocument();
    expect(loader).toBeTruthy();
});
