const { faker } = require('@faker-js/faker');
const { createMockDebate } = require('./debate');

function createMockArgument() {
    return {
        id: faker.datatype.number(),
        content: faker.datatype.string(length = 100),
        upvotes: faker.datatype.number(),
        group_id: faker.datatype.number(),
        is_reply: false,
        created_at: faker.date.between(),
        score: faker.datatype.float({ max: 100 }),
        moderation_score: faker.datatype.float({ max: 100 }),
        status: 'accepted',
        title: null,
        direct_url: faker.internet.url(),
        reply_to_id: null,
        group_type: 'Group',
        group: {
            ...createMockDebate()
        },
        sources: [],
        author: {
            id: faker.datatype.number(),
            first_name: faker.datatype.string(length = 10),
            last_name: faker.datatype.string(length = 10),
            slug: faker.lorem.slug(),
            image_url: faker.internet.url(),
            full_name: faker.datatype.string(length = 20),
            level: {
                id: faker.datatype.number(),
                name: 'Novice du débat',
                icon_url: faker.internet.url()
            },
            description: null,
            last_activity: faker.date.between(),
            is_expert: false,
            is_admin: false,
            points: faker.datatype.number(),
            eloquence_title: null
        },
        position: { id: faker.datatype.number(), name: 'Non' }
    };
}

module.exports = {
    createMockArgument
}