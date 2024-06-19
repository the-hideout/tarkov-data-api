class WorkerKV {
    constructor(kvName, dataSource) {
        this.cache = {};
        this.loading = {};
        this.kvName = kvName;
        this.loadingPromises = {};
        this.loadingInterval = false;
        this.dataExpires = {};
        this.dataSource = dataSource;
        this.gameModes = ['regular'];
    }

    async getCache(context, info, forceRegular) {
        const requestId = typeof context === 'object' ? context.requestId : context;
        const gameMode = this.getGameMode(context, info);
        let requestKv = this.kvName;
        if (gameMode !== 'regular' && !forceRegular) {
            requestKv += `_${gameMode}`;
        }
        if (this.cache[gameMode] && (!this.dataExpires[gameMode] || new Date() < this.dataExpires[gameMode])) {
            //console.log(`${requestKv} is fresh; not refreshing`);
            this.dataSource.setKvUsedForRequest(requestKv, requestId);
            return {cache: this.cache[gameMode], gameMode};
        }
        if (this.dataSource.kvLoadedForRequest(requestKv, requestId)) {
            //console.log(`${requestKv} already loaded for request ${requestId}; not refreshing`);
            return {cache: this.cache[gameMode], gameMode};
        }
        if (this.cache[gameMode]) {
            console.log(`${requestKv} is stale; re-loading`);
            this.cache[gameMode] = false;
            this.loading[gameMode] = false;
        } else {
            //console.log(`${requestKv} loading`);
        }
        if (!this.loadingPromises[gameMode]) {
            this.loadingPromises[gameMode] = {};
        }
        if (this.loading[gameMode]) {
            if (this.loadingPromises[gameMode][requestId]) {
                return this.loadingPromises[gameMode][requestId];
            }
            //console.log(`${requestKv} already loading; awaiting load`);
            this.loadingPromises[gameMode][requestId] = new Promise((resolve) => {
                const startLoad = new Date();
                let loadingTimedOut = false;
                const loadingTimeout = setTimeout(() => {
                    loadingTimedOut = true;
                }, 3000);
                const loadingInterval = setInterval(() => {
                    if (this.loading[gameMode] === false) {
                        clearTimeout(loadingTimeout);
                        clearInterval(loadingInterval);
                        console.log(`${requestKv} load: ${new Date() - startLoad} ms (secondary)`);
                        delete this.loadingPromises[gameMode][requestId];
                        this.dataSource.setKvUsedForRequest(requestKv, requestId);
                        return resolve({cache: this.cache[gameMode], gameMode});
                    }
                    if (loadingTimedOut) {
                        console.log(`${requestKv} loading timed out; forcing load`);
                        clearInterval(loadingInterval);
                        this.loading[gameMode] = false;
                        delete this.loadingPromises[gameMode][requestId];
                        return resolve(this.getCache(context, info));
                    }
                }, 100);
            });
            return this.loadingPromises[gameMode][requestId];
        }
        this.loading[gameMode] = true;
        this.loadingPromises[gameMode][requestId] = new Promise((resolve, reject) => {
            const startLoad = new Date();
            this.dataSource.env.DATA_CACHE.getWithMetadata(requestKv, 'text').then(async response => {
                console.log(`${requestKv} load: ${new Date() - startLoad} ms`);
                const metadata = response.metadata;
                let responseValue = response.value;
                if (metadata && metadata.compression) {
                    return reject(new Error(`${metadata.compression} compression is not supported`));
                }
                const parsedValue = JSON.parse(responseValue);
                if (parsedValue.errors && parsedValue.errors[0].code === 10009 && requestKv !== this.kvName) {
                    console.warn(`${requestKv} data not found; falling back to ${this.kvName}`);
                    this.loading[gameMode] = false;
                    delete this.loadingPromises[gameMode][requestId];
                    return resolve(this.getCache(context, info, true));
                }
                this.cache[gameMode] = parsedValue;
                let newDataExpires = false;
                if (this.cache[gameMode]?.expiration) {
                    newDataExpires = new Date(this.cache[gameMode].expiration).valueOf();
                }
                if (newDataExpires && this.dataExpires === newDataExpires) {
                    console.log(`${requestKv} is still stale after re-load`);
                }
                this.dataExpires[gameMode] = newDataExpires;
                this.dataSource.setKvLoadedForRequest(requestKv, requestId);
                this.loading[gameMode] = false;
                delete this.loadingPromises[gameMode][requestId];
                this.postLoad({cache: this.cache[gameMode], gameMode});
                resolve({cache: this.cache[gameMode], gameMode});
            }).catch(error => {
                this.loading[gameMode] = false;
                reject(error);
            });
        });
        return this.loadingPromises[gameMode][requestId];
    }

    getGameMode(context, info) {
        let gameMode = context.util.getGameMode(info, context);
        if (!this.gameModes.includes(gameMode)) {
            gameMode = this.gameModes[0];
        }
        return gameMode;
    }

    getLocale(key, context, info) {
        if (!key) {
            return null;
        }
        const lang = context.util.getLang(info, context);
        const gameMode = this.getGameMode(context, info);
        const getTranslation = (k) => {
            if (this.cache[gameMode]?.locale && this.cache[gameMode].locale[lang] && typeof this.cache[gameMode].locale[lang][k] !== 'undefined') {
                return this.cache[gameMode].locale[lang][k];
            }
            if (this.cache[gameMode]?.locale && this.cache[gameMode].locale.en && typeof this.cache[gameMode].locale.en[k] !== 'undefined') {
                return this.cache[gameMode].locale.en[k];
            }
            const errorMessage = `Missing translation for key ${k}`;
            if (!context.errors.some(err => err.message === errorMessage)) {
                context.errors.push({message: errorMessage});
            }
            return k;
        };
        if (Array.isArray(key)) {
            return key.map(k => getTranslation(k)).filter(Boolean);
        }
        return getTranslation(key);
    }

    postLoad() { /* some KVs may require initial processing after retrieval */ }
}

export default WorkerKV;
