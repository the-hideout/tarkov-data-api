export default {
    Query: {
        achievements(obj, args, context, info) {
            return context.util.paginate(context.data.worker.task.getAchievements(context, info), args);
        },
        async tasks(obj, args, context, info) {
            let tasks = await context.data.worker.task.getList(context, info);
            if (args.faction) {
                const filterFaction = args.faction.toLowerCase();
                tasks = tasks.filter(task => {
                    if (!task.factionName) return true;
                    const taskFaction = task.factionName.toLowerCase();
                    return taskFaction === 'any' || taskFaction === filterFaction;
                });
            }
            return context.util.paginate(tasks, args);
        },
        task(obj, args, context, info) {
            return context.data.worker.task.get(context, info, args.id);
        },
        quests(obj, args, context, info) {
            context.warnings.push(`The quests query is deprecated and provided only for backwards compatibility purposes. Please use the tasks query, which includes the latest quests/tasks information.`);
            return context.data.worker.task.getQuests(context, info);
        },
        questItems(obj, args, context, info) {
            return context.data.worker.task.getQuestItems(context, info);
        }
    },
    Achievement: {
        name(data, args, context, info) {
            return context.data.worker.task.getLocale(data.name, context, info);
        },
        description(data, args, context, info) {
            return context.data.worker.task.getLocale(data.description, context, info);
        },
        side(data, args, context, info) {
            return context.data.worker.task.getLocale(data.side, context, info);
        },
        rarity(data, args, context, info) {
            return context.data.worker.task.getLocale(data.rarity, context, info);
        },
    },
    HealthEffect: {
        bodyParts(data, args, context, info) {
            if (data.bodyParts.length === 0) {
                return [];
            }
            return context.data.worker.task.getLocale(data.bodyParts, context, info);
        },
        effects(data, args, context, info) {
            if (data.effects.length === 0) {
                return [];
            }
            return context.data.worker.task.getLocale(data.effects, context, info);
        },
    },
    MapWithPosition: {
        map(data, args, context, info) {
            return context.data.worker.map.get(context, info, data.map);
        },
    },
    SkillLevel: {
        skill(data, args, context, info) {
            return context.data.worker.handbook.getSkill(context, info, data.name);
        },
        name(data, args, context, info) {
            return context.data.worker.task.getLocale(data.name, context, info);
        },
    },
    Task: {
        name(data, args, context, info) {
            return context.data.worker.task.getLocale(data.name, context, info);
        },
        trader(data, args, context, info) {
            return context.data.worker.trader.get(context, info, data.trader);
        },
        map(data, args, context, info) {
            if (data.location_id) return context.data.worker.map.get(context, info, data.location_id);
            return null;
        }
    },
    TaskKey: {
        keys(data, args, context, info) {
            return data.key_ids.map(id => {
                return context.data.worker.item.getItem(context, info, id);
            });
        },
        map(data, args, context, info) {
            if (data.map_id) return context.data.worker.map.get(context, info, data.map_id);
            return null;
        }
    },
    TaskObjective: {
        __resolveType(data, args, context) {
            //return data.gql_type;
            if (data.type === 'findQuestItem' || data.type === 'giveQuestItem' || data.type === 'plantQuestItem') {
                return 'TaskObjectiveQuestItem';
            } else if (data.type === 'findItem' || data.type === 'giveItem' || data.type === 'plantItem' || data.type === 'sellItem') {
                return 'TaskObjectiveItem';
            } else if (data.type === 'mark') {
                return 'TaskObjectiveMark';
            } else if (data.type === 'extract') {
                return 'TaskObjectiveExtract';
            } else if (data.type === 'skill') {
                return 'TaskObjectiveSkill';
            } else if (data.type === 'traderLevel') {
                return 'TaskObjectiveTraderLevel';
            } else if (data.type === 'taskStatus') {
                return 'TaskObjectiveTaskStatus';
            } else if (data.type === 'playerLevel') {
                return 'TaskObjectivePlayerLevel';
            } else if (data.type === 'experience') {
                return 'TaskObjectiveExperience';
            } else if (data.type === 'shoot') {
                return 'TaskObjectiveShoot';
            } else if (data.type === 'buildWeapon') {
                return 'TaskObjectiveBuildItem';
            } else if (data.type === 'traderStanding') {
                return 'TaskObjectiveTraderStanding';
            } else if (data.type === 'useItem') {
                return 'TaskObjectiveUseItem';
            }
            return 'TaskObjectiveBasic';
        },
        maps(data, args, context, info) {
            return data.map_ids.map(id => {
                return context.data.worker.map.get(context, info, id);
            });
        }
    },
    TaskObjectiveBasic: {
        maps(data, args, context, info) {
            return data.map_ids.map(id => {
                return context.data.worker.map.get(context, info, id);
            });
        },
        description(data, args, context, info) {
            return context.data.worker.task.getLocale(data.description, context, info);
        },
        requiredKeys(data, args, context, info) {
            if (!data.requiredKeys) {
                return null;
            }
            return data.requiredKeys.map(keyIds => keyIds.map(keyId => context.data.worker.item.getItem(context, info, keyId)));
        },
    },
    TaskObjectiveBuildItem: {
        item(data, args, context, info) {
            return context.data.worker.item.getItem(context, info, data.item);
        },
        containsAll(data, args, context, info) {
            return data.containsAll.map((item) => {
                return context.data.worker.item.getItem(context, info, item.id);
            });
        },
        containsCategory(data, args, context, info) {
            return data.containsCategory.map((cat) => {
                return context.data.worker.handbook.getCategory(context, info, cat.id);
            });
        },
        containsOne(data, args, context, info) {
            return data.containsOne.map((item) => {
                return context.data.worker.item.getItem(context, info, item.id);
            });
        },
        maps(data, args, context, info) {
            return data.map_ids.map(id => {
                return context.data.worker.map.get(context, info, id);
            });
        },
        description(data, args, context, info) {
            return context.data.worker.task.getLocale(data.description, context, info, info);
        }
    },
    TaskObjectiveExperience: {
        maps(data, args, context, info) {
            return data.map_ids.map(id => {
                return context.data.worker.map.get(context, info, id);
            });
        },
        description(data, args, context, info) {
            return context.data.worker.task.getLocale(data.description, context, info);
        }
    },
    TaskObjectiveExtract: {
        maps(data, args, context, info) {
            return data.map_ids.map(id => {
                return context.data.worker.map.get(context, info, id);
            });
        },
        description(data, args, context, info) {
            return context.data.worker.task.getLocale(data.description, context, info);
        },
        exitName(data, args, context, info) {
            return context.data.worker.task.getLocale(data.exitName, context, info);
        },
        exitStatus(data, args, context, info) {
            return context.data.worker.task.getLocale(data.exitStatus, context, info);
        },
        zoneNames(data, args, context, info) {
            if (data.zoneNames.length === 0) {
                return [];
            }
            return context.data.worker.task.getLocale(data.zoneNames, context, info);
        },
        requiredKeys(data, args, context, info) {
            if (!data.requiredKeys) {
                return null;
            }
            return data.requiredKeys.map(keyIds => keyIds.map(keyId => context.data.worker.item.getItem(context, info, keyId)));
        },
    },
    TaskObjectiveItem: {
        item(data, args, context, info) {
            return context.data.worker.item.getItem(context, info, data.item);
        },
        items(data, args, context, info) {
            return data.items.map(id => context.data.worker.item.getItem(context, info, id));
        },
        maps(data, args, context, info) {
            return data.map_ids.map(id => {
                return context.data.worker.map.get(context, info, id);
            });
        },
        description(data, args, context, info) {
            return context.data.worker.task.getLocale(data.description, context, info);
        },
        requiredKeys(data, args, context, info) {
            if (!data.requiredKeys) {
                return null;
            }
            return data.requiredKeys.map(keyIds => keyIds.map(keyId => context.data.worker.item.getItem(context, info, keyId)));
        },
    },
    TaskObjectiveMark: {
        markerItem(data, args, context, info) {
            return context.data.worker.item.getItem(context, info, data.item_id);
        },
        maps(data, args, context, info) {
            return data.map_ids.map(id => {
                return context.data.worker.map.get(context, info, id);
            });
        },
        description(data, args, context, info) {
            return context.data.worker.task.getLocale(data.description, context, info);
        },
        requiredKeys(data, args, context, info) {
            if (!data.requiredKeys) {
                return null;
            }
            return data.requiredKeys.map(keyIds => keyIds.map(keyId => context.data.worker.item.getItem(context, info, keyId)));
        },
    },
    TaskObjectivePlayerLevel: {
        maps(data, args, context, info) {
            return data.map_ids.map(id => {
                return context.data.worker.map.get(context, info, id);
            });
        },
        description(data, args, context, info) {
            return context.data.worker.task.getLocale(data.description, context, info);
        }
    },
    TaskObjectiveQuestItem: {
        async questItem(data, args, context, info) {
            return context.data.worker.task.getQuestItem(context, info, data.item_id);
        },
        maps(data, args, context, info) {
            return data.map_ids.map(id => {
                return context.data.worker.map.get(context, info, id);
            });
        },
        description(data, args, context, info) {
            return context.data.worker.task.getLocale(data.description, context, info);
        },
        requiredKeys(data, args, context, info) {
            if (!data.requiredKeys) {
                return null;
            }
            return data.requiredKeys.map(keyIds => keyIds.map(keyId => context.data.worker.item.getItem(context, info, keyId)));
        },
    },
    TaskObjectiveSkill: {
        maps(data, args, context, info) {
            return data.map_ids.map(id => {
                return context.data.worker.map.get(context, info, id);
            });
        },
        description(data, args, context, info) {
            return context.data.worker.task.getLocale(data.description, context, info);
        }
    },
    TaskObjectiveShoot: {
        bodyParts(data, args, context, info) {
            if (!data.bodyParts || data.bodyParts.length === 0) return [];
            return context.data.worker.task.getLocale(data.bodyParts, context, info);
        },
        target(data, args, context, info) {
            return context.data.worker.task.getLocale(data.target, context, info);
        },
        targetNames(data, args, context, info) {
            const targets = data.targetNames || [];
            return targets.map(target => context.data.worker.task.getLocale(target, context, info));
        },
        usingWeapon(data, args, context, info) {
            return data.usingWeapon.map(item => {
                return context.data.worker.item.getItem(context, info, item.id);
            });
        },
        usingWeaponMods(data, args, context, info) {
            return data.usingWeaponMods.map(itemGroup => {
                return itemGroup.map(item => {
                    return context.data.worker.item.getItem(context, info, item.id);
                });
            });
        },
        wearing(data, args, context, info) {
            return data.wearing.map(itemGroup => {
                return itemGroup.map(item => {
                    return context.data.worker.item.getItem(context, info, item.id);
                });
            });
        },
        notWearing(data, args, context, info) {
            return data.notWearing.map((item) => {
                return context.data.worker.item.getItem(context, info, item.id);
            });
        },
        maps(data, args, context, info) {
            return data.map_ids.map(id => {
                return context.data.worker.map.get(context, info, id);
            });
        },
        description(data, args, context, info) {
            return context.data.worker.task.getLocale(data.description, context, info);
        },
        zoneNames(data, args, context, info) {
            if (data.zoneNames.length === 0) {
                return [];
            }
            return context.data.worker.task.getLocale(data.zoneNames, context, info);
        },
        requiredKeys(data, args, context, info) {
            if (!data.requiredKeys) {
                return null;
            }
            return data.requiredKeys.map(keyIds => keyIds.map(keyId => context.data.worker.item.getItem(context, info, keyId)));
        },
    },
    TaskObjectiveTaskStatus: {
        task(data, args, context, info) {
            return context.data.worker.task.get(context, info, data.task);
        },
        maps(data, args, context, info) {
            return data.map_ids.map(id => {
                return context.data.worker.map.get(context, info, id);
            });
        },
        description(data, args, context, info) {
            return context.data.worker.task.getLocale(data.description, context, info);
        }
    },
    TaskObjectiveTraderLevel: {
        trader(data, args, context, info) {
            return context.data.worker.trader.get(context, info, data.trader_id);
        },
        maps(data, args, context, info) {
            return data.map_ids.map(id => {
                return context.data.worker.map.get(context, info, id);
            });
        },
        description(data, args, context, info) {
            return context.data.worker.task.getLocale(data.description, context, info);
        }
    },
    TaskObjectiveTraderStanding: {
        trader(data, args, context, info) {
            return context.data.worker.trader.get(context, info, data.trader_id);
        },
        maps(data, args, context, info) {
            return data.map_ids.map(id => {
                return context.data.worker.map.get(context, info, id);
            });
        },
        description(data, args, context, info) {
            return context.data.worker.task.getLocale(data.description, context, info);
        }
    },
    TaskObjectiveUseItem: {
        maps(data, args, context, info) {
            return data.map_ids.map(id => {
                return context.data.worker.map.get(context, info, id);
            });
        },
        description(data, args, context, info) {
            return context.data.worker.task.getLocale(data.description, context, info);
        },
        useAny(data, args, context, info) {
            return Promise.all(data.useAny.map(id => context.data.worker.item.getItem(context, info, id)));
        },
        zoneNames(data, args, context, info) {
            return context.data.worker.task.getLocale(data.zoneNames, context, info);
        },
        requiredKeys(data, args, context, info) {
            if (!data.requiredKeys) {
                return null;
            }
            return data.requiredKeys.map(keyIds => keyIds.map(keyId => context.data.worker.item.getItem(context, info, keyId)));
        },
    },
    TaskZone: {
        map(data, args, context, info) {
            return context.data.worker.map.get(context, info, data.map);
        },
    },
    QuestItem: {
        name(data, args, context, info) {
            return context.data.worker.task.getLocale(data.name, context, info);
        },
        shortName(data, args, context, info) {
            return context.data.worker.task.getLocale(data.shortName, context, info);
        },
        description(data, args, context, info) {
            return context.data.worker.task.getLocale(data.description, context, info);
        },
    },
    TaskRewards: {
        traderUnlock(data, args, context, info) {
            return Promise.all(data.traderUnlock.map(unlock => {
                return context.data.worker.trader.get(context, info, unlock.trader_id);
            }));
        },
        async craftUnlock(data, args, context, info) {
            if (!data.craftUnlock) {
                return [];
            }
            if (data.craftUnlock.length === 0) {
                return [];
            }
            const crafts = await context.data.worker.craft.getList(context, info);
            return data.craftUnlock.map(unlock => {
                return crafts.find(c => {
                    if (c.station !== unlock.station_id || c.level !== unlock.level) {
                        return false;
                    }
                    if (c.rewardItems[0].item !== unlock.items[0].id) {
                        return false;
                    }
                    return true;
                });
            }).filter(Boolean);
        }
    },
    TaskStatusRequirement: {
        task(data, args, context, info) {
            return context.data.worker.task.get(context, info, data.task);
        }
    },
    OfferUnlock: {
        item(data, args, context, info) {
            if (data.contains && Array.isArray(data.contains) && data.contains.length > 0) return context.data.worker.item.getItem(context, info, data.item, data.contains);
            return context.data.worker.item.getItem(context, info, data.item);
        },
        trader(data, args, context, info) {
            return context.data.worker.trader.get(context, info, data.trader_id)
        }
    },
    Quest: {
        giver(data, args, context, info) {
            return context.data.worker.trader.get(context, info, context.data.worker.trader.getDataIdMap()[data.giver]);
        },
        turnin(data, args, context, info) {
            return context.data.worker.trader.get(context, info, context.data.worker.trader.getDataIdMap()[data.turnin]);
        }
    },
    QuestObjective: {
        async targetItem(data, args, context, info) {
            if (!data.targetItem) return null;
            try {
                return await context.data.worker.item.getItem(context, info, data.targetItem)
            } catch (error) {
                if (error.message.includes('No item found with id')) return null;
                return Promise.reject(error);
            }
        }
    },
    QuestRequirement: {
        prerequisiteQuests(data, args, context, info) {
            return data.prerequisiteQuests.map(questArray => {
                return questArray.map(questId => {
                    return context.data.worker.task.getQuest(context, info, questId);
                });
            });
        }
    },
    QuestRewardReputation: {
        async trader(data, args, context, info) {
            return context.data.worker.trader.get(context, info, context.data.worker.trader.getDataIdMap()[data.trader]);
        }
    }
};
