import cluster from 'node:cluster';
import { availableParallelism } from 'node:os';
import * as Sentry from "@sentry/node";
import "./instrument.mjs";
import { createServer } from 'node:http';

import 'dotenv/config';

import getYoga from '../graphql-yoga.mjs';
import getEnv from './env-binding.mjs';
import cacheMachine from '../utils/cache-machine.mjs';

const port = process.env.PORT ?? 8788;
const workerCount = parseInt(process.env.WORKERS ?? String(Math.max(availableParallelism() - 1, 1)));

/*process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception', error.stack);
});*/

if (cluster.isPrimary && workerCount > 0) {
    const kvStore = {};
    const kvLoading = {};
    const kvRefreshTimeout = {};
    const cachePending = {};
    const msOneMinute = 1000 * 60;
    const msFiveMinutes = msOneMinute * 5;
    const msHalfHour = msOneMinute * 30;
    const env = getEnv();

    const getKv = async (kvName, rejectOnError = true) => {
        let refreshTime = msHalfHour;
        try {
            console.log(`getting ${kvName} data`);
            clearTimeout(kvRefreshTimeout[kvName]);
            const oldExpiration = kvStore[kvName]?.expiration ?? 0;
            kvLoading[kvName] = env.DATA_CACHE.get(kvName, 'json');
            const data = await kvLoading[kvName];
            kvStore[kvName] = data;
            delete kvLoading[kvName];
            if (data?.expiration && new Date(data.expiration) > new Date()) {
                refreshTime = new Date(data.expiration) - new Date();
                if (refreshTime < msOneMinute) {
                    refreshTime = msOneMinute;
                }
            }
            if (data?.expiration === oldExpiration) {
                refreshTime = msOneMinute;
            }
            return data;
        } catch (error) {
            delete kvLoading[kvName];
            console.error('Error getting KV from cloudflare', error);
            if (error.message !== 'Invalid CLOUDFLARE_TOKEN') {
                refreshTime = msOneMinute;
                if (typeof kvStore[kvName] === 'undefined') {
                    refreshTime = 1000;
                }
            }
            if (rejectOnError) {
                return Promise.reject(error);
            }
        } finally {
            kvRefreshTimeout[kvName] = setTimeout(() => {
                getKv(kvName, false);
            }, refreshTime);
        }
    };

    cluster.on('message', async (worker, message) => {
        // Add worker message span
        const rcvWorkerMsgSpan = Sentry.startInactiveSpan({ name: "Receive worker message" });
        //console.log(`message from worker ${id}:`, message);
        let response = false;
        if (message.action === 'getKv') {
            response = {
                action: 'kvData',
                kvName: message.kvName,
                id: message.id,
            };
            try {
                if (typeof kvStore[message.kvName] !== 'undefined') {
                    response.data = JSON.stringify(kvStore[message.kvName]);
                } else if (kvLoading[message.kvName]) {
                    response.data = JSON.stringify(await kvLoading[message.kvName]);
                } else {
                    response.data = JSON.stringify(await getKv(message.kvName));
                }
            } catch (error) {
                response.error = error.message;
            }
        }
        if (message.action === 'cacheResponse') {
            response = {
                id: message.id,
                data: false,
            };
            try {
                if (cachePending[message.key]) {
                    response.data = await cachePending[message.key];
                } else {
                    let cachePutCooldown = message.ttl ? message.ttl * 1000 : msFiveMinutes;
                    cachePending[message.key] = cacheMachine.put(process.env, message.body, {key: message.key, ttl: message.ttl}).catch(error => {
                        cachePutCooldown = 10000;
                        return Promise.reject(error);
                    }).finally(() => {
                        setTimeout(() => {
                            delete cachePending[message.key];
                        }, cachePutCooldown);
                    });
                    response.data = await cachePending[message.key];
                }
            } catch (error) {
                response.error = error.message;
            }
            
        }
        if (response) {
            if (worker.isConnected() && !worker.isDead()) {
                try {
                    worker.send(response);
                } catch (error) {
                    console.error(`Error sending worker ${message.action} message response`, error);
                }
            }
        }
        // End the span
        rcvWorkerMsgSpan.end();
    });

    cluster.on('exit', function (worker, code, signal) {
        if (!signal) {
            console.log('worker ' + worker.process.pid + ' died');
            cluster.fork();
        }
    });

    console.log(`Starting ${workerCount} workers`);
    for (let i = 0; i < workerCount; i++) {
        cluster.fork();
    }
} else {
    // Workers can share any TCP connection
    const yoga = await getYoga(getEnv());

    const server = createServer(yoga);

    // Start the server and you're done!
    server.listen(port, () => {
        console.info(`Server is running on http://localhost:${port}`);
    });
}
