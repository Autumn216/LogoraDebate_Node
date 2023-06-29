import React from "react";
import { IconsLibrary } from "./Icons.composition";
import { render, screen } from '@testing-library/react';

it ('renders IconsLibrary component', () => {  
    render(<IconsLibrary />);

    const versusIcon = screen.getByTestId("versus-icon");
    expect(versusIcon).toBeTruthy();
    
    const alarmIcon = screen.getByTestId("alarm-icon");
    expect(alarmIcon).toBeTruthy();
})