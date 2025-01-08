import fetchWithTimeout from './fetch-with-timeout.mjs';

import * as Sentry from '@sentry/node';

// cache url
const cacheUrl = 'https://cache.tarkov.dev'

let cacheFailCount = 0;
let cachePaused = false;

function cacheIsPaused() {
    if (!cachePaused) {
        return false;
    }
    const coolDownExpired = new Date() - cachePaused > 60000;
    if (coolDownExpired) {
        cachePaused = false;
        return false;
    }
    return true;
}

function cacheRequestFail() {
    cacheFailCount++;
    if (cacheFailCount <= 4 || cacheIsPaused()) {
        return;
    }
    cachePaused = new Date();
}

// Helper function to create a hash from a string
// :param string: string to hash
// :return: SHA-256 hash of string
async function hash(string) {
    const utf8 = new TextEncoder().encode(string);
    const hashBuffer = await crypto.subtle.digest('SHA-256', utf8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray
        .map((bytes) => bytes.toString(16).padStart(2, '0'))
        .join('');

    return hashHex;
}

const cacheMachine = {
    createKey: (env, query, variables = {}, specialCache = '') => {
        if (typeof variables !== 'string') {
            variables = JSON.stringify(variables);
        }
        if (typeof query !== 'string') {
            query = JSON.stringify(query);
        }
        query = query.trim();
        return hash(env.ENVIRONMENT + query + variables + specialCache);
    },
    // Checks the caching service to see if a request has been cached
    // :param json: the json payload of the incoming worker request
    // :return: json results of the item found in the cache or false if not found
    get: async (env, options = {}) => {
        try {
            if (!env.CACHE_BASIC_AUTH) {
                console.warn('env.CACHE_BASIC_AUTH is not set; skipping cache check');
                return false;
            }
            if (cacheIsPaused()) {
                console.warn('Cache paused; skipping cache check');
                return false;
            }
            let query = options.query ?? '';
            query = query.trim();
            let { key, variables = {}, specialCache = '' } = options;
            key = key ?? await cacheMachine.createKey(env, query, variables, specialCache);
            //console.log('getting cache ', key, typeof query, query);
            if (!key) {
                console.warn('Skipping cache check; key is empty');
                return false;
            }
    
            const response = await fetchWithTimeout(`${cacheUrl}/api/cache?key=${key}`, { 
                headers: {
                    'content-type': 'application/json;charset=UTF-8',
                    'Authorization': `Basic ${env.CACHE_BASIC_AUTH}`
                }, 
            });
            cacheFailCount = 0;
            if (response.status === 200) {
                return await response.json();
            } else if (response.status !== 404) {
                console.error(`failed to read from cache: ${response.status}`);
            }
            response.body.cancel();
    
            return false
        } catch (error) {
            if (error.message === 'The operation was aborted due to timeout') {
                console.warn('Checking cache timed out');
                cacheRequestFail();
                return false;
            }
            console.error('checkCache error: ' + error.message);
            return false;
        }
    },
    // Updates the cache with the results of a query
    // :param json: the incoming request in json
    // :param body: the body to cache
    // :return: true if successful, false if not
    put: async (env, body, options = {}) => {
        try {
            if (!env.CACHE_BASIC_AUTH) {
                console.warn('env.CACHE_BASIC_AUTH is not set; skipping cache put');
                return false;
            }
            if (cacheIsPaused()) {
                console.warn('Cache paused; skipping cache update');
                return false;
            }
            if (!options.key && !options.query) {
                console.warn('Key or query not provided, skipping cache put');
                return false;
            }
            let { key, query, variables, ttl = 60 * 5, specialCache = '' } = options;
            if (!key) {
                query = query.trim();
                key = await cacheMachine.createKey(env, query, variables, specialCache);
            }
            ttl = String(ttl);
            console.log(`Caching ${body.length} byte response for ${env.ENVIRONMENT} environment${ttl ? ` for ${ttl} seconds` : ''}`);
    
            // Update the cache
            const response = await fetchWithTimeout(`${cacheUrl}/api/cache`, {
                body: JSON.stringify({ key, value: body, ttl }),
                method: 'POST',
                headers: {
                    'content-type': 'application/json;charset=UTF-8',
                    'Authorization': `Basic ${env.CACHE_BASIC_AUTH}`
                    // Spans don't appear to be propagating properly through the graphql server from the http server :(
                    // This might be because they are two distinct node packages
                    //'sentry-trace': Sentry.spanToTraceHeader(Sentry.getActiveSpan()),
                    //'baggage': Sentry.spanToBaggageHeader(Sentry.getActiveSpan()),
                },
                timeout: 10000,
            });
            console.log('Response cached');
            response.body.cancel();
    
            // Log non-200 responses
            if (response.status !== 200) {
                console.error(`failed to write to cache: ${response.status}`);
                return false
            }
            cacheFailCount = 0;
            return true
        } catch (error) {
            if (error.message === 'The operation was aborted due to timeout') {
                console.warn('Updating cache timed out');
                cacheRequestFail();
                return false;
            }
            console.error('updateCache error: ' + error.message);
            return false;
        }
    },
};

export default cacheMachine;
