import React from "react";
import { DefaultDebateBox } from './DebateBox.composition';
import { render, screen } from '@testing-library/react';

it ('renders DebateBox component', () => {  
    const { getByText } = render(<DefaultDebateBox />);
    expect(getByText(/Transition écologique: faut-il investir davantage dans le transport ferroviaire ?/i)).toBeInTheDocument();
})

it ('renders DebateBox with correct links', () => {  
    const { getByText } = render(<DefaultDebateBox />);
    expect(screen.getByText(/Transition écologique: faut-il investir davantage dans le transport ferroviaire ?/i).closest('a')).toHaveAttribute('href', '/espace-debat/group/transition-ecologique-faut-il-investir-davantage-dans-le-transport-ferroviaire-ytPDq')
})