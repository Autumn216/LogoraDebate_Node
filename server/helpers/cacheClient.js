// CACHE CLIENT
const Memcache = require('memcache-pp');
const cacheManager = require('cache-manager');
const memcachedStore = require('cache-manager-memcached-store');

const cacheClient = cacheManager.caching({
    store: memcachedStore,
    driver: Memcache,
    options: {
        hosts: [process.env.MEMCACHED_URL],
        autodiscover: true,
        disabled: process.env.DISABLE_CACHE || false
    },
    ttl: 480,
});

module.exports = cacheClient;