const { faker } = require('@faker-js/faker');

function createMockConsultation() {
    return {
        id: faker.datatype.number(),
        slug: faker.lorem.slug(),
        title: faker.datatype.string(length = 10),
        created_at: faker.date.between(),
        ends_at: faker.date.between(),
        vote_goal: faker.datatype.number({min: 1000}),
        total_votes: faker.datatype.number({max: 200}),
        total_participants: faker.datatype.number({max: 200}),
        proposals_count: faker.datatype.number({max: 200}),
        direct_url: faker.internet.url(),
        synthesis_description: null,
        proposals: [],
        online_users_count: faker.datatype.number({max: 200})
    };
}

module.exports = {
    createMockConsultation
}