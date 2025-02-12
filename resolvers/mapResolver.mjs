export default {
    Query: {
        async bosses(obj, args, context, info) {
            let bosses = false;
            let filters = {
                name: async names => {
                    return context.data.worker.map.getBossesByNames(context, info, names, bosses);
                },
            }
            const nonFilterArgs = ['lang', 'gameMode', 'limit', 'offset'];
            for (const argName in args) {
                if (nonFilterArgs.includes(argName)) continue;
                if (!filters[argName]) return Promise.reject(new Error(`${argName} is not a recognized argument`));
                bosses = await filters[argName](args[argName], bosses);
            }
            if (!bosses) {
                bosses = context.data.worker.map.getAllBosses(context, info);
            }
            return context.util.paginate(bosses, args);
        },
        async goonReports( obj, args, context, info) {
            let reports = context.data.worker.map.getGoonReports(context, info);
            return context.util.paginate(reports, args);
        },
        async lootContainers(obj, args, context, info) {
            let containers = context.data.worker.map.getAllLootContainers(context, info);
            return context.util.paginate(containers, args);
        },
        async maps(obj, args, context, info) {
            let maps = false;
            let filters = {
                name: async names => {
                    return context.data.worker.map.getMapsByNames(context, info, names, maps);
                },
                enemies: async enemies => {
                    return context.data.worker.map.getMapsByEnemies(context, info, enemies, maps);
                },
            }
            const nonFilterArgs = ['lang', 'gameMode', 'limit', 'offset'];
            for (const argName in args) {
                if (nonFilterArgs.includes(argName)) continue;
                if (!filters[argName]) return Promise.reject(new Error(`${argName} is not a recognized argument`));
                maps = await filters[argName](args[argName], maps);
            }
            if (!maps) {
                maps = context.data.worker.map.getList(context, info);
            }
            return context.util.paginate(maps, args);
        },
        async stationaryWeapons(obj, args, context, info) {
            const stationaryWeapons = context.data.worker.map.getAllStationaryWeapons(context, info);
            return context.util.paginate(stationaryWeapons, args);
        },
    },
    GoonReport: {
        map(data, args, context, info) {
            return context.data.worker.map.get(context, info, data.map);
        }
    },
    HealthPart: {
        bodyPart(data, args, context, info) {
            return context.data.worker.map.getLocale(data.bodyPart, context, info);
        }
    },
    Lock: {
        key(data, args, context, info) {
            return context.data.worker.item.getItem(context, info, data.key);
        },
    },
    LootContainer: {
        name(data, args, context, info) {
            return context.data.worker.map.getLocale(data.name, context, info);
        },
    },
    LootContainerPosition: {
        lootContainer(data, args, context, info) {
            return context.data.worker.map.getLootContainer(context, info, data.lootContainer);
        },
    },
    LootLoosePosition: {
        items(data, args, context, info) {
            return context.data.worker.item.getItemsByIDs(context, info, data.items);
        },
    },
    Map: {
        accessKeys(data, args, context, info) {
            return context.data.worker.item.getItemsByIDs(context, info, data.accessKeys);
        },
        name(data, args, context, info) {
            return context.data.worker.map.getLocale(data.name, context, info);
        },
        description(data, args, context, info) {
            return context.data.worker.map.getLocale(data.description, context, info);
        },
        enemies(data, args, context, info) {
            return context.data.worker.map.getLocale(data.enemies, context, info);
        }
    },
    MapExtract: {
        name(data, args, context, info) {
            return context.data.worker.map.getLocale(data.name, context, info);
        },
        switches(data, args, context, info) {
            if (!data.switches) {
                return [];
            }
            return data.switches.map(switchId => context.data.worker.map.getSwitch(context, info, switchId));
        },
    },
    MapHazard: {
        name(data, args, context, info) {
            return context.data.worker.map.getLocale(data.name, context, info);
        },
    },
    MapSwitch: {
        /*door(data, args, context) {

        },*/
        /*extract(data, args, context) {
            return context.data.worker.map.getExtract(context, data.extract);
        },*/
        /*extractTip(data, args, context, info) {
            if (!data.extractTip) {
                return null;
            }
            return context.data.worker.map.getLocale(data.extractTip, context, info);
        },*/
        activatedBy(data, args, context, info) {
            return context.data.worker.map.getSwitch(context, info, data.activatedBy);
        },
        name(data, args, context, info) {
            if (!data.name) {
                return null;
            }
            return context.data.worker.map.getLocale(data.name, context, info);
        },
    },
    MapSwitchOperation: {
        target(data, args, context, info) {
            if (data.switch) {
                return context.data.worker.map.getSwitch(context, info, data.switch);
            }
            return context.data.worker.map.getExtract(context, info, data.extract);
        },
    },
    MapSwitchTarget: {
        __resolveType(data, args, context) {
            if (data.switchType) return 'MapSwitch';
            return 'MapExtract';
        },
    },
    MapTransit: {
        conditions(data, args, context, info) {
            if (!data.conditions) {
                return null;
            }
            return context.data.worker.map.getLocale(data.conditions, context, info);
        },
        description(data, args, context, info) {
            if (!data.description) {
                return null;
            }
            return context.data.worker.map.getLocale(data.description, context, info);
        },
        map(data, args, context, info) {
            return context.data.worker.map.get(context, info, data.map);
        },
    },
    MobInfo: {
        name(data, args, context, info) {
            return context.data.worker.map.getLocale(data.name, context, info);
        }
    },
    BossSpawn: {
        boss(data, args, context, info) {
            return context.data.worker.map.getMobInfo(context, info, data.id);
        },
        async name(data, args, context, info) {
            const boss = await context.data.worker.map.getMobInfo(context, info, data.id);
            return context.data.worker.map.getLocale(boss.name, context, info);
        },
        async normalizedName(data, args, context, info) {
            const boss = await context.data.worker.map.getMobInfo(context, info, data.id);
            return boss.normalizedName;
        },
        async spawnTrigger(data, args, context, info) {
            return context.data.worker.map.getLocale(data.spawnTrigger, context, info);
        },
        async switch(data, args, context, info) {
            return context.data.worker.map.getSwitch(context, info, data.switch);
        },
    },
    BossSpawnLocation: {
        name(data, args, context, info) {
            return context.data.worker.map.getLocale(data.name, context, info);
        },
    },
    BossEscort: {
        boss(data, args, context, info) {
            return context.data.worker.map.getMobInfo(context, info, data.id);
        },
        async name(data, args, context, info) {
            const boss = await context.data.worker.map.getMobInfo(context, info, data.id);
            return context.data.worker.map.getLocale(boss.name, context, info);
        },
        async normalizedName(data, args, context, info) {
            const boss = await context.data.worker.map.getMobInfo(context, info, data.id);
            return boss.normalizedName;
        }
    },
    StationaryWeapon: {
        name(data, args, context, info) {
            return context.data.worker.map.getLocale(data.name, context, info);
        },
        shortName(data, args, context, info) {
            return context.data.worker.map.getLocale(data.shortName, context, info);
        },
    },
    StationaryWeaponPosition: {
        stationaryWeapon(data, args, context, info) {
            return context.data.worker.map.getStationaryWeapon(context, info, data.stationaryWeapon);
        },
    },
};
