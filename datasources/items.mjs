import WorkerKV from '../utils/worker-kv.mjs';

class ItemsAPI extends WorkerKV {
    constructor(dataSource) {
        super('item_data', dataSource);
        this.gameModes.push('pve');
    }

    postLoad({ cache }) {
        for (const item of Object.values(cache.Item)) {
            // add trader prices to sellFor
            item.sellFor = item.traderPrices.map((traderPrice) => {
                return {
                    price: traderPrice.price,
                    currency: traderPrice.currency,
                    currencyItem: traderPrice.currencyItem,
                    priceRUB: traderPrice.priceRUB,
                    vendor: {
                        trader: traderPrice.trader,
                        trader_id: traderPrice.trader,
                        traderLevel: 1,
                        minTraderLevel: 1,
                        taskUnlock: null
                    },
                    source: traderPrice.source,
                    requirements: [],
                };
            });

            item.buyFor = [];
            // add flea prices to sellFor and buyFor
            if (!item.types.includes('noFlea') && item.lastLowPrice) {
                item.sellFor.push({
                    price: item.lastLowPrice || 0,
                    currency: 'RUB',
                    currencyItem: '5449016a4bdc2d6f028b456f',
                    priceRUB: item.lastLowPrice || 0,
                    vendor: cache.FleaMarket,
                    source: 'fleaMarket',
                    requirements: [{
                        type: 'playerLevel',
                        value: cache.FleaMarket.minPlayerLevel,
                    }],
                });

                item.buyFor.push({
                    price: item.avg24hPrice || item.lastLowPrice || 0,
                    currency: 'RUB',
                    currencyItem: '5449016a4bdc2d6f028b456f',
                    priceRUB: item.avg24hPrice || item.lastLowPrice || 0,
                    vendor: cache.FleaMarket,
                    source: 'fleaMarket',
                    requirements: [{
                        type: 'playerLevel',
                        value: cache.FleaMarket.minPlayerLevel,
                    }],
                });
            }
        }
    }

    async getItem(context, info, id, contains) {
        const { cache } = await this.getCache(context, info);
        let item = cache.Item[id];
        if (!item) {
            return Promise.reject(new Error(`No item found with id ${id}`));
        }

        if (contains && Array.isArray(contains)) {
            item.containsItems = contains.map((cItem) => {
                if (!cItem.attributes) cItem.attributes = [];
                if (!cItem.count) cItem.count = 1;
                return cItem;
            });
        }
        return item;
    }

    async getAllItems(context, info) {
        const { cache } = await this.getCache(context, info);
        return Object.values(cache.Item);
    }

    async getItemsByIDs(context, info, ids, items = false) {
        const { cache } = await this.getCache(context, info);
        if (!items) {
            items = Object.values(cache.Item);
        }
        return items.filter((item) => ids.includes(item.id));
    }

    async getItemsByType(context, info, type, items = false) {
        const { cache } = await this.getCache(context, info);
        if (!items) {
            items = Object.values(cache.Item);
        }
        return items.filter((item) => item.types.includes(type) || type === 'any');
    }

    async getItemsByTypes(context, info, types, items = false) {
        const { cache } = await this.getCache(context, info);
        if (!items) {
            items = Object.values(cache.Item);
        }
        if (types.includes('any')) {
            return items;
        }
        return items.filter((item) => types.some(type => item.types.includes(type)));
    }

    async getItemsByName(context, info, name, items = false) {
        const { cache } = await this.getCache(context, info);
        if (!items) {
            items = Object.values(cache.Item);
        }
        const searchString = name.toLowerCase();
        if (searchString === '') return Promise.reject(new Error('Searched item name cannot be blank'));

        return items.filter((item) => {
            if (this.getLocale(item.name, context, info).toString().toLowerCase().includes(searchString)) {
                return true;
            }
            if (this.getLocale(item.shortName, context, info).toString().toLowerCase().includes(searchString)) {
                return true;
            }
            return false;
        });
    }

    async getItemsByNames(context, info, names, items = false) {
        const { cache } = await this.getCache(context, info);
        if (!items) {
            items = Object.values(cache.Item);
        }
        const searchStrings = names.map(name => {
            if (name === '') throw new Error('Searched item name cannot be blank');
            return name.toLowerCase();
        });
        return items.filter((item) => {
            for (const search of searchStrings) {
                if (this.getLocale(item.name, context, info).toString().toLowerCase().includes(search)) {
                    return true;
                }
                if (this.getLocale(item.shortName, context, info).toString().toLowerCase().includes(search)) {
                    return true;
                }
            }
            return false;
        });
    }

    async getItemsByBsgCategoryId(context, info, bsgCategoryId, items = false) {
        const { cache } = await this.getCache(context, info);
        if (!items) {
            items = Object.values(cache.Item);
        }
        return items.filter((item) => item.bsgCategoryId === bsgCategoryId);
    }

    async getItemsByBsgCategoryIds(context, info, bsgCategoryIds, items = false) {
        const { cache } = await this.getCache(context, info);
        if (!items) {
            items = Object.values(cache.Item);
        }
        return items.filter((item) => bsgCategoryIds.some(catId => catId === item.bsgCategoryId));
    }

    async getItemsByCategoryEnums(context, info, names, items = false) {
        const { cache } = await this.getCache(context, info);
        if (!items) {
            items = Object.values(cache.Item);
        }
        const categories = (await context.data.worker.handbook.getCategories(context, info)).filter(cat => names.includes(cat.enumName));
        return items.filter((item) => {
            return item.categories.some(catId => categories.some(cat => cat.id === catId));
        });
    }

    async getItemsByHandbookCategoryEnums(context, info, names, items = false) {
        const { cache } = await this.getCache(context, info);
        if (!items) {
            items = Object.values(cache.Item);
        }
        const categories = (await context.data.worker.handbook.getHandbookCategories(context, info)).filter(cat => names.includes(cat.enumName));
        return items.filter((item) => {
            return item.handbookCategories.some(catId => categories.some(cat => cat.id === catId));
        });
    }

    async getItemsInBsgCategory(context, info, bsgCategoryId, items = false) {
        const { cache } = await this.getCache(context, info);
        if (!items) {
            items = Object.values(cache.Item);
        }
        return items.filter(item => item.categories.includes(bsgCategoryId));
    }

    async getItemByNormalizedName(context, info, normalizedName) {
        const { cache } = await this.getCache(context, info);
        const item = Object.values(cache.Item).find((item) => item.normalizedName === normalizedName);

        if (!item) {
            return null;
        }

        return item;
    }

    async getItemsByDiscardLimitedStatus(context, info, limited, items = false) {
        const { cache } = await this.getCache(context, info);
        if (!items) {
            items = Object.values(cache.Item);
        }
        return items.filter(item => {
            return (item.discardLimit > -1 && limited) || (item.discardLimit == -1 && !limited);
        });
    }

    async getFleaMarket(context, info) {
        const { cache } = await this.getCache(context, info);
        return cache.FleaMarket;
    }

    async getAmmoList(context, info) {
        const allAmmo = await this.getItemsByBsgCategoryId(context, info, '5485a8684bdc2da71d8b4567').then(ammoItems => {
            // ignore bb
            return ammoItems.filter(item => item.id !== '6241c316234b593b5676b637');
        });
        const itemProperties = await context.data.worker.handbook.getAllItemProperties(context, info);
        return allAmmo.map(item => {
            return {
                ...item,
                ...itemProperties[item.id],
            };
        });
    }
}

export default ItemsAPI;
