const { faker } = require('@faker-js/faker');

function createMockDebate() {
    const debateName = faker.datatype.string(length = 10);
    return {
        id: faker.datatype.number(),
        is_active: true,
        score: 0.0,
        name: debateName,
        slug: faker.lorem.slug(),
        direct_url: faker.internet.url(),
        reduced_synthesis: false,
        first_position_argument_count: faker.datatype.number(),
        second_position_argument_count: faker.datatype.number(),
        votes_count: {},
        group_context: {
            id: faker.datatype.number(),
            name: debateName,
            created_at: faker.date.between(),
            positions: [
            {
                id: faker.datatype.number(),
                name: faker.datatype.string()
            },
            {
                id: faker.datatype.number(),
                name: faker.datatype.string()
            }
            ]
        },
        online_users_count: faker.datatype.number()
    };
}

module.exports = {
    createMockDebate
}