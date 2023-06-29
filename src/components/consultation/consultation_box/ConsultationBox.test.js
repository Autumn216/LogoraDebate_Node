import React from "react";
import { DefaultConsultationBox } from './ConsultationBox.composition';
import { render } from '@testing-library/react';
import { faker } from '@faker-js/faker';

const consultation = {
    id: 19,
    slug: faker.lorem.slug(),
    title: faker.music.songName(),
    description: faker.commerce.productDescription(),
    description_url: "",
    created_at: faker.date.recent(),
    ends_at: faker.date.future(),
    vote_goal: 1000,
    total_votes: 200,
    total_participants: 44,
    proposals_count: 53,
    image_url: faker.image.nature(),
    direct_url: faker.internet.url(),
    tags: [
        {
            id: 37,
            name: faker.science.chemicalElement().name,
            taggings_count: 0,
            display_name: faker.science.chemicalElement().name
        },
    ]
}

describe('ConsultationBox', () => {
    it ('renders ConsultationBox component', () => {  
        const { getByText } = render(<DefaultConsultationBox consultation={consultation} />);
        expect(getByText(consultation.title)).toBeInTheDocument();
    })

    it ('renders a clickable title redirecting to the correct link', () => {  
        const { getByText } = render(<DefaultConsultationBox consultation={consultation} />);
        expect(getByText(consultation.title).closest('a')).toHaveAttribute('href', '/espace-debat/consultation/' + consultation.slug)
    })
})