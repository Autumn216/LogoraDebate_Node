import React from 'react';
import { IntlProvider } from 'react-intl';
import { DialogBox } from './DialogBox';
import { ConfigProvider } from '@logora/debate.context.config_provider';

export const DefaultDialogBox = () => {
    return (
        <IntlProvider locale='en'>
            <ConfigProvider config={{theme:{}}}>
                <DialogBox 
                    isBottom
                    isPoints 
                    titleKey={"info.debates"} 
                    contentKey={"info.debate.first_time"}
                    isHidden={false}
                >
                    <span>React child</span>
                </DialogBox>
            </ConfigProvider>
        </IntlProvider>
    )
};

export const HiddenDialogBox = () => {
    return (
        <IntlProvider locale='en'>
            <ConfigProvider config={{theme:{}}}>
                <DialogBox 
                    isBottom
                    isPoints 
                    titleKey={"info.debates"} 
                    contentKey={"info.debate.first_time"}
                    isHidden={true}
                >
                    <span>React child</span>
                </DialogBox>
            </ConfigProvider>
        </IntlProvider>
    )
};

