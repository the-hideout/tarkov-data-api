const WorkerKV = require('../utils/worker-kv');

class historicalPricesAPI extends WorkerKV {
    constructor() {
        super('historical_price_data');
        this.refreshInterval = 1000 * 60 * 30;
    }

    async getByItemId(itemId) {
        await this.init();
        if (!this.cache) {
            return Promise.reject(new Error('Historical prices cache is empty'));
        }
        if (!this.cache.data[itemId]) return [];
        return this.cache.data[itemId];
    }
}

module.exports = historicalPricesAPI;
