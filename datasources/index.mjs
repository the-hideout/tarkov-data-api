import BartersAPI from './barters.mjs';
import CraftsAPI from './crafts.mjs';
import HandbookAPI from './handbook.mjs';
import HideoutAPI from './hideout.mjs';
import HistoricalPricesAPI from './historical-prices.mjs';
import ArchivedPricesAPI from './archived-prices.mjs';
import ItemsAPI from './items.mjs';
import MapAPI from './maps.mjs';
import SchemaAPI from './schema.mjs';
import StatusAPI from './status.mjs';
import TasksAPI from './tasks.mjs';
import TraderInventoryAPI from './trader-inventory.mjs';
import TradersAPI from './traders.mjs';

class DataSource {
    constructor(env) {
        this.env = env;

        this.initialized = false;
        this.loading = false;
        this.requests = {};
        this.kvLoaded = [];

        this.worker = {
            barter: new BartersAPI(this),
            craft: new CraftsAPI(this),
            handbook: new HandbookAPI(this),
            hideout: new HideoutAPI(this),
            historicalPrice: new HistoricalPricesAPI(this),
            archivedPrice: new ArchivedPricesAPI(this),
            item: new ItemsAPI(this),
            map: new MapAPI(this),
            schema: new SchemaAPI(this),
            status: new StatusAPI(this),
            task: new TasksAPI(this),
            trader: new TradersAPI(this),
            traderInventory: new TraderInventoryAPI(this),
        };
    }

    kvLoadedForRequest(kvName, requestId) {
        if (!requestId) {
            return false;
        }
        if (!this.requests[requestId]) {
            this.requests[requestId] = {};
        }
        if (!this.requests[requestId].kvLoaded) {
            this.requests[requestId].kvLoaded = [];
        }
        return this.requests[requestId].kvLoaded.includes(kvName);
    }

    setKvUsedForRequest(kvName, requestId) {
        if (!this.requests[requestId]) {
            this.requests[requestId] = {};
        }
        if (!this.requests[requestId].kvUsed) {
            this.requests[requestId].kvUsed = [];
        }
        if (!this.requests[requestId].kvUsed.includes(kvName)) {
            this.requests[requestId].kvUsed.push(kvName);
        }
    }

    setKvLoadedForRequest(kvName, requestId) {
        if (!this.kvLoaded.includes(kvName)) {
            this.kvLoaded.push(kvName);
        }
        if (!this.requests[requestId]) {
            this.requests[requestId] = {};
        }
        if (!this.requests[requestId].kvLoaded) {
            this.requests[requestId].kvLoaded = [];
        }
        if (!this.requests[requestId].kvLoaded.includes(kvName)) {
            this.requests[requestId].kvLoaded.push(kvName);
        }
        this.setKvUsedForRequest(kvName, requestId);
    }

    getRequestTtl(requestId) {
        if (!this.requests[requestId] || !this.requests[requestId].kvUsed) {
            return 0;
        }
        let lowestExpire = Number.MAX_SAFE_INTEGER;
        let schemaExpire = Number.MAX_SAFE_INTEGER;
        for (const worker of Object.values(this.worker)) {
            if (!this.requests[requestId].kvUsed.includes(worker.kvName)) {
                continue;
            }
            if (worker.kvName === 'schema_data') {
                schemaExpire = worker.dataExpires;
                continue;
            }
            if (typeof worker.dataExpires !== 'boolean' && worker.dataExpires < lowestExpire) {
                lowestExpire = worker.dataExpires;
            }
        }
        if (!lowestExpire) {
            lowestExpire = schemaExpire;
        }
        if (lowestExpire === Number.MAX_SAFE_INTEGER) {
            lowestExpire = 0;
        }
        let ttl = Math.round((lowestExpire - new Date().valueOf()) / 1000);
        if (ttl <= 0) {
            ttl = 0;
        }
        ttl = Math.max(ttl, 60 * 5);
        return ttl;
    }

    clearRequestData(requestId) {
        delete this.requests[requestId];
    }
}

export default DataSource;
