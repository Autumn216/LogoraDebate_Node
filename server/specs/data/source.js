const { faker } = require('@faker-js/faker');

function createMockSource() {
    return {
        id: faker.datatype.number(),
        uid: faker.lorem.slug(),
        title: faker.datatype.string(length = 10),
        publisher: faker.datatype.string(length = 10),
        origin_image_url: null,
        source_url: faker.internet.url(),
        published_date: faker.date.between(),
        tags: [
            { id: faker.datatype.number(), name: faker.datatype.string(), taggings_count: 0, display_name: faker.datatype.string() },
            { id: faker.datatype.number(), name: faker.datatype.string(), taggings_count: 0, display_name: faker.datatype.string() },
            { id: faker.datatype.number(), name: faker.datatype.string(), taggings_count: 0, display_name: faker.datatype.string() },
            { id: faker.datatype.number(), name: faker.datatype.string(), taggings_count: 0, display_name: faker.datatype.string() },
            { id: faker.datatype.number(), name: faker.datatype.string(), taggings_count: 0, display_name: faker.datatype.string() },
            { id: faker.datatype.number(), name: faker.datatype.string(), taggings_count: 0, display_name: faker.datatype.string() },
            { id: faker.datatype.number(), name: faker.datatype.string(), taggings_count: 0, display_name: faker.datatype.string() },
            { id: faker.datatype.number(), name: faker.datatype.string(), taggings_count: 0, display_name: faker.datatype.string() },
            { id: faker.datatype.number(), name: faker.datatype.string(), taggings_count: 0, display_name: faker.datatype.string() },
            { id: faker.datatype.number(), name: faker.datatype.string(), taggings_count: 0, display_name: faker.datatype.string() },
            { id: faker.datatype.number(), name: faker.datatype.string(), taggings_count: 0, display_name: faker.datatype.string() }
        ]
    }
}

module.exports = {
    createMockSource
}