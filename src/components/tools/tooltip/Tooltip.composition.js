import React from 'react';
import { Tooltip } from './Tooltip';

export const HoverTooltip = () => {
    return <Tooltip text="Hover tooltip">
        <h3>Hover tooltip</h3>
    </Tooltip>;
};

export const HoverAndClickTooltip = () => {
    return <Tooltip text="Hover tooltip" onClickText="Clicked!">
        <h4>Hover and click tooltip</h4>
    </Tooltip>;
};