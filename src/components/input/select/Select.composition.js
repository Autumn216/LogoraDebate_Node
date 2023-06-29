import React from 'react';
import { Select } from './Select';

export const DefaultSelect = () => {
    const options = [
        {
            dataTid: "action_sort_arguments_newest",
            name: "Most recent",
            value: "trending",
            text: "Most recent"
        },
        {
            dataTid: "action_sort_arguments_relevant",
            name: "Most relevant",
            value: "-created_at",
            text: "Most relevant"
        },
        {
            dataTid: "action_sort_arguments_oldest",
            name: "Oldest",
            value: "+created_at",
            text: "Oldest"
        }
    ]
    return (
        <Select options={options} />
    )
};