import React from 'react';
import { SourcePreview } from './SourcePreview';

const SOURCE = { 
    publisher: 'Le Canard Enchaîné', 
    title: 'La Fifa multiplie fautes et coups pas francs', 
    description: "Pour complaire au Qatar, les instances du foot banissent la bière.", 
    source_url: "https://example.com/source",
    origin_image_url: 'https://picsum.photos/536/354'
};

export const LoadedSourcePreview = () => {
    return <SourcePreview source={SOURCE} showLoader={false} />;
};

export const LoadingSourcePreview = () => {
    return <SourcePreview source={SOURCE} showLoader={true} />;
};