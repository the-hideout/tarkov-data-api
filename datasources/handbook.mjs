import WorkerKV from '../utils/worker-kv.mjs';

class HandbookAPI extends WorkerKV {
    constructor(dataSource) {
        super('handbook_data', dataSource);
        //this.gameModes.push('pve');
    }

    async getCategory(context, info, id) {
        const { cache } = await this.getCache(context, info);
        return cache.ItemCategory[id] || cache.HandbookCategory[id];
    }

    async getTopCategory(context, info, id) {
        const cat = await this.getCategory(context, info, id);
        if (cat && cat.parent_id) return this.getTopCategory(context, info, cat.parent_id);
        return cat;
    }

    async getCategories(context, info) {
        const { cache } = await this.getCache(context, info);
        if (!cache) {
            return Promise.reject(new Error('Item cache is empty'));
        }
        const categories = [];
        for (const id in cache.ItemCategory) {
            categories.push(cache.ItemCategory[id]);
        }
        return categories;
    }

    async getCategoriesEnum(context, info) {
        const cats = await this.getCategories(context, info);
        const map = {};
        for (const id in cats) {
            map[cats[id].enumName] = cats[id];
        }
        return map;
    }

    async getHandbookCategory(context, info, id) {
        const { cache } = await this.getCache(context, info);
        return cache.HandbookCategory[id];
    }

    async getHandbookCategories(context, info) {
        const { cache } = await this.getCache(context, info);
        if (!cache) {
            return Promise.reject(new Error('Item cache is empty'));
        }
        return Object.values(cache.HandbookCategory);
    }

    async getArmorMaterials(context, info) {
        const { cache } = await this.getCache(context, info);
        return Object.values(cache.ArmorMaterial).sort();
    }

    async getArmorMaterial(context, info, matKey) {
        const { cache } = await this.getCache(context, info);
        return cache.ArmorMaterial[matKey];
    }

    async getMasterings(context, info) {
        const { cache } = await this.getCache(context, info);
        return cache.Mastering;
    }

    async getMastering(context, info, mastId) {
        const { cache } = await this.getCache(context, info);
        return cache.Mastering.find(m => m.id === mastId);
    }

    async getSkills(context, info) {
        const { cache } = await this.getCache(context, info);
        return cache.Skill;
    }

    async getSkill(context, info, skillId) {
        const { cache } = await this.getCache(context, info);
        return cache.Skill.find(s => s.id === skillId);
    }

    async getPlayerLevels(context, info) {
        const { cache } = await this.getCache(context, info);
        return cache.PlayerLevel;
    }

    async getAllItemProperties(context, info) {
        const { cache } = await this.getCache(context, info);
        return cache.ItemProperties;
    }

    async getItemProperties(context, info, itemId) {
        const { cache } = await this.getCache(context, info);
        return cache.ItemProperties[itemId];
    }
}

export default HandbookAPI;
