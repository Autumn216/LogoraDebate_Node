import React from 'react';
import { AnnouncementDialog } from './AnnouncementDialog';
import { AnnouncementIcon } from '@logora/debate.icons';

export const DefaultAnnouncementDialog = () => {
    return (
        <AnnouncementDialog 
            icon={AnnouncementIcon}
            message={"An announcement message !"}
        />
    );
};