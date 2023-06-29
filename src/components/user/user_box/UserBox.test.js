import React from "react";
import { DefaultUserBox, user } from './UserBox.composition';
import { render } from '@testing-library/react';

it ('renders UserBox component', () => {  
    const { getByText } = render(<DefaultUserBox />);
    expect(getByText(user.full_name)).toBeInTheDocument();
})