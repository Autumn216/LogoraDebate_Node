import React from "react";
import { DefaultSuggestionBlankBox } from "./SuggestionBlankBox.composition";
import { render } from '@testing-library/react';

it ('renders SuggestionBlankBox component correctly', () => {  
    const { getByText } = render(<DefaultSuggestionBlankBox />);
    expect(getByText(/Add suggestion/i)).toBeInTheDocument();
})

it ('renders SuggestionBlankBox with correct link', () => {  
    const { getByText } = render(<DefaultSuggestionBlankBox />);
    expect(getByText(/Add suggestion/i).closest('a')).toHaveAttribute('href', '/espace-debat/suggestions');
})