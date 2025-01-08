export default {
    Query: {
        item(obj, args, context, info) {
            if (args.id) return context.data.worker.item.getItem(context, info, args.id);
            if (args.normalizedName) return context.data.worker.item.getItemByNormalizedName(context, info, args.normalizedName);
            return Promise.reject(new Error('You must specify either the id or the normalizedName argument'));
        },
        async items(obj, args, context, info) {
            let items = false;
            let filters = {
                ids: async ids => {
                    return context.data.worker.item.getItemsByIDs(context, info, ids, items);
                },
                name: async name => {
                    return context.data.worker.item.getItemsByName(context, info, name, items);
                },
                names: async names => {
                    return context.data.worker.item.getItemsByNames(context, info, names, items);
                },
                type: async type => {
                    return context.data.worker.item.getItemsByType(context, info, type, items);
                },
                types: async types => {
                    return context.data.worker.item.getItemsByTypes(context, info, types, items);
                },
                categoryNames: async bsgcats => {
                    return context.data.worker.item.getItemsByCategoryEnums(context, info, bsgcats, items);
                },
                handbookCategoryNames: async handbookcats => {
                    return context.data.worker.item.getItemsByHandbookCategoryEnums(context, info, handbookcats, items);
                },
                bsgCategoryId: async bsgcat => {
                    return context.data.worker.item.getItemsByBsgCategoryId(context, info, bsgcat, items);
                },
                bsgCategoryIds: async bsgcats => {
                    return context.data.worker.item.getItemsByBsgCategoryIds(context, info, bsgcats, items);
                },
                bsgCategory: async bsgcat => {
                    return context.data.worker.item.getItemsInBsgCategory(context, info, bsgcat, items);
                },
                /*discardLimited: async limited => {
                    return context.data.worker.item.getItemsByDiscardLimitedStatus(limited, items);
                },*/
            }
            //if (Object.keys(args).length === 0) return context.data.worker.item.getAllItems();
            for (const argName in args) {
                if (!filters[argName]) continue;
                items = await filters[argName](args[argName]);
            }
            if (!items) {
                items = context.data.worker.item.getAllItems(context, info);
            }
            return context.util.paginate(items, args);
        },
        itemCategories(obj, args, context, info) {
            return context.util.paginate(context.data.worker.handbook.getCategories(context, info), args);
        },
        handbookCategories(obj, args, context, info) {
            return context.util.paginate(context.data.worker.handbook.getHandbookCategories(context, info), args);
        },
        itemsByIDs(obj, args, context, info) {
            return context.data.worker.item.getItemsByIDs(context, info, args.ids, false);
        },
        itemsByType(obj, args, context, info) {
            return context.data.worker.item.getItemsByType(context, info, args.type, false);
        },
        itemsByName(obj, args, context, info) {
            return context.data.worker.item.getItemsByName(context, info, args.name);
        },
        itemByNormalizedName(obj, args, context, info) {
            return context.data.worker.item.getItemByNormalizedName(context, info, args.normalizedName);
        },
        itemsByBsgCategoryId(obj, args, context, info) {
            return context.data.worker.item.getItemsByBsgCategoryId(context, info, args.bsgCategoryId);
        },
        async itemPrices(obj, args, context, info) {
            const [
                historical,
                archived,
            ] = await Promise.all([
                context.data.worker.historicalPrice.getByItemId(context, info, args.id, 30),
                context.data.worker.archivedPrice.getByItemId(context, info, args.id),
            ]);
            return context.util.paginate([...archived, ...historical], args);
        },
        historicalItemPrices(obj, args, context, info) {
            return context.util.paginate(context.data.worker.historicalPrice.getByItemId(context, info, args.id, args.days), args);
        },
        archivedItemPrices(obj, args, context, info) {
            return context.util.paginate(context.data.worker.archivedPrice.getByItemId(context, info, args.id), args);
        },
        armorMaterials(obj, args, context, info) {
            return context.data.worker.handbook.getArmorMaterials(context, info);
        },
        fleaMarket(obj, args, context, info) {
            return context.data.worker.item.getFleaMarket(context, info);
        },
        mastering(obj, args, context, info) {
            return context.data.worker.handbook.getMasterings(context, info);
        },
        playerLevels(obj, args, context, info) {
            return context.data.worker.handbook.getPlayerLevels(context, info);
        },
        skills(obj, args, context, info) {
            return context.data.worker.handbook.getSkills(context, info);
        },
    },
    Item: {
        name(data, args, context, info) {
            return context.data.worker.item.getLocale(data.name, context, info);
        },
        shortName(data, args, context, info) {
            return context.data.worker.item.getLocale(data.shortName, context, info);
        },
        description(data, args, context, info) {
            return context.data.worker.item.getLocale(data.description, context, info);
        },
        async buyFor(data, args, context, info) {
            if (!data.buyFor) data.buyFor = [];
            return [
                ...await context.data.worker.traderInventory.getByItemId(context, info, data.id),
                ...data.buyFor
            ];
        },
        bsgCategory(data, args, context, info) {
            if (data.bsgCategoryId) return context.data.worker.handbook.getCategory(context, info, data.bsgCategoryId);
            return null;
        },
        category(data, args, context, info) {
            if (data.bsgCategoryId) return context.data.worker.handbook.getCategory(context, info, data.bsgCategoryId);
            return null;
        },
        categoryTop(data, args, context, info) {
            if (data.bsgCategoryId) return context.data.worker.handbook.getTopCategory(context, info, data.bsgCategoryId);
            return null;
        },
        categories(data, args, context, info) {
            return data.categories.map(id => {
                return context.data.worker.handbook.getCategory(context, info, id);
            });
        },
        handbookCategories(data, args, context, info) {
            return data.handbookCategories.map(id => {
                return context.data.worker.handbook.getCategory(context, info, id);
            });
        },
        async conflictingItems(data, args, context, info) {
            return Promise.all(data.conflictingItems.map(async id => {
                const item = await context.data.worker.item.getItem(context, info, id).catch(error => {
                    console.warn(`item ${id} not found for conflictingItems`);
                    return null;
                });

                return item;
            }));
        },
        usedInTasks(data, args, context, info) {
            return context.data.worker.task.getTasksRequiringItem(context, info, data.id);
        },
        receivedFromTasks(data, args, context, info,) {
            return context.data.worker.task.getTasksProvidingItem(context, info, data.id);
        },
        bartersFor(data, args, context, info) {
            return context.data.worker.barter.getBartersForItem(context, info, data.id);
        },
        bartersUsing(data, args, context, info) {
            return context.data.worker.barter.getBartersUsingItem(context, info, data.id);
        },
        craftsFor(data, args, context, info) {
            return context.data.worker.craft.getCraftsForItem(context, info, data.id);
        },
        craftsUsing(data, args, context, info) {
            return context.data.worker.craft.getCraftsUsingItem(context, info, data.id);
        },
        async fleaMarketFee(data, args, context, info) {
            if (data.types.includes('noFlea')) return null;
            const options = {
                price: data.lastLowPrice || data.basePrice,
                intelCenterLevel: 0,
                hideoutManagementLevel: 0,
                count: 1,
                requireAll: false,
                ...args
            };
            const flea = await context.data.worker.item.getFleaMarket(context, info);
            const q = options.requireAll ? 1 : options.count;
            const vo = data.basePrice * (options.count / q);
            const vr = options.price;
            let po = Math.log10(vo / vr);
            if (vr < vo) po = Math.pow(po, 1.08);
            let pr = Math.log10(vr / vo);
            if (vr >= vo) pr = Math.pow(pr, 1.08);
            const ti = flea.sellOfferFeeRate;
            const tr = flea.sellRequirementFeeRate;
            let fee = (vo * ti * Math.pow(4.0, po) * q) + (vr * tr * Math.pow(4.0, pr) * q);
            if (options.intelCenterLevel >= 3) {
                let discount = 0.3;
                discount = discount + (discount * options.hideoutManagementLevel * 0.01);
                fee = fee - (fee * discount);
            }
            if (fee > Number.MAX_SAFE_INTEGER) {
                fee = Number.MAX_SAFE_INTEGER;
            }
            if (fee < Number.MIN_SAFE_INTEGER) {
                fee = Number.MIN_SAFE_INTEGER;
            }
            return Math.round(fee);
        },
        async historicalPrices(data, args, context, info) {
            context.util.testDepthLimit(info, 1);
            const warningMessage = `Querying historicalPrices on the Item object will only provide half the prices from the last ${context.data.worker.historicalPrice.itemLimitDays} days. For up to ${context.data.worker.historicalPrice.maxDays} days of historical prices, use the historicalItemPrices query.`;
            if (!context.warnings.some(warning => warning.message === warningMessage)) {
                context.warnings.push({message: warningMessage});
            }
            return context.data.worker.historicalPrice.getByItemId(context, info, data.id, context.data.worker.historicalPrice.itemLimitDays, true);
        },
        imageLink(data) {
            return data.inspectImageLink;
        },
        iconLinkFallback(data) {
            return data.iconLink
        },
        gridImageLinkFallback(data) {
            return data.gridImageLink
        },
        imageLinkFallback(data) {
            return data.inspectImageLink;
        },
        properties(data, args, context, info) {
            return context.data.worker.handbook.getItemProperties(context, info, data.id);
        }
    },
    ItemArmorSlot: {
        __resolveType(data) {
            if (data.allowedPlates) return 'ItemArmorSlotOpen';
            return 'ItemArmorSlotLocked';
        }
    },
    ItemArmorSlotLocked: {
        name(data, args, context, info) {
            return context.data.worker.handbook.getLocale(data.name, context, info);
        },
        zones(data, args, context, info) {
            return context.data.worker.handbook.getLocale(data.zones, context, info);
        },
        material(data, args, context, info) {
            return context.data.worker.handbook.getArmorMaterial(context, info, data.armor_material_id);
        },
    },
    ItemArmorSlotOpen: {
        name(data, args, context, info) {
            return context.data.worker.handbook.getLocale(data.name, context, info);
        },
        zones(data, args, context, info) {
            return context.data.worker.handbook.getLocale(data.zones, context, info);
        },
        allowedPlates(data, args, context, info) {
            return data.allowedPlates.map(id => context.data.worker.item.getItem(context, info, id));
        },
    },
    ItemAttribute: {
        type(data, args, context) {
            if (data.type) return data.type;
            return data.name;
        },
        name(data) {
            if (data.name) return data.name;
            return data.type;
        }
    },
    ItemCategory: {
        name(data, args, context, info) {
            return context.data.worker.handbook.getLocale(data.name, context, info);
        },
        parent(data, args, context, info) {
            if (data.parent_id) return context.data.worker.handbook.getCategory(context, info, data.parent_id);
            return null;
        },
        children(data, args, context, info) {
            return data.child_ids.map(id => context.data.worker.handbook.getCategory(context, info, id));
        }
    },
    ItemFilters: {
        allowedCategories(data, args, context, info) {
            return data.allowedCategories.map(id => context.data.worker.handbook.getCategory(context, info, id));
        },
        allowedItems(data, args, context, info) {
            return data.allowedItems.map(id => context.data.worker.item.getItem(context, info, id));
        },
        excludedCategories(data, args, context, info) {
            return data.excludedCategories.map(id => context.data.worker.handbook.getCategory(context, info, id));
        },
        excludedItems(data, args, context, info) {
            return data.excludedItems.map(id => context.data.worker.item.getItem(context, info, id));
        },
    },
    ItemPrice: {
        currencyItem(data, args, context, info) {
            return context.data.worker.item.getItem(context, info, data.currencyItem);
        }
    },
    ItemProperties: {
        __resolveType(data) {
            if (data.propertiesType) return data.propertiesType;
            return null;
        }
    },
    ItemPropertiesArmor: {
        armorType(data, args, context, info) {
            return context.data.worker.handbook.getLocale(data.armorType, context, info);
        },
        material(data, args, context, info) {
            return context.data.worker.handbook.getArmorMaterial(context, info, data.armor_material_id);
        },
        zones(data, args, context, info) {
            return context.data.worker.handbook.getLocale(data.zones, context, info);
        },
    },
    ItemPropertiesArmorAttachment: {
        material(data, args, context, info) {
            return context.data.worker.handbook.getArmorMaterial(context, info, data.armor_material_id);
        },
        headZones(data, args, context, info) {
            return context.data.worker.handbook.getLocale(data.headZones, context, info);
        },
        zones(data, args, context, info) {
            return context.data.worker.handbook.getLocale(data.headZones, context, info);
        }
    },
    ItemPropertiesBackpack: {
        pouches(data) {
            return data.grids;
        }
    },
    ItemPropertiesChestRig: {
        armorType(data, args, context, info) {
            return context.data.worker.handbook.getLocale(data.armorType, context, info);
        },
        material(data, args, context, info) {
            return context.data.worker.handbook.getArmorMaterial(context, info, data.armor_material_id);
        },
        zones(data, args, context, info) {
            return context.data.worker.handbook.getLocale(data.zones, context, info);
        },
        pouches(data) {
            return data.grids;
        }
    },
    ItemPropertiesGlasses: {
        material(data, args, context, info) {
            return context.data.worker.handbook.getArmorMaterial(context, info, data.armor_material_id);
        },
    },
    ItemPropertiesHelmet: {
        armorType(data, args, context, info) {
            return context.data.worker.handbook.getLocale(data.armorType, context, info);
        },
        material(data, args, context, info) {
            return context.data.worker.handbook.getArmorMaterial(context, info, data.armor_material_id);
        },
        headZones(data, args, context, info) {
            return context.data.worker.handbook.getLocale(data.headZones, context, info);
        }
    },
    ItemPropertiesMagazine: {
        allowedAmmo(data, args, context, info) {
            return data.allowedAmmo.map(id => context.data.worker.item.getItem(context, info, id));
        }
    },
    ItemPropertiesPreset: {
        baseItem(data, args, context, info) {
            return context.data.worker.item.getItem(context, info, data.base_item_id);
        }
    },
    ItemPropertiesWeapon: {
        defaultAmmo(data, args, context, info) {
            if (!data.default_ammo_id) return null;
            return context.data.worker.item.getItem(context, info, data.default_ammo_id);
        },
        fireModes(data, args, context, info) {
            return context.data.worker.handbook.getLocale(data.fireModes, context, info);
        },
        allowedAmmo(data, args, context, info) {
            return data.allowedAmmo.map(id => context.data.worker.item.getItem(context, info, id));
        },
        defaultPreset(data, args, context, info) {
            if (!data.defaultPreset) return null;
            return context.data.worker.item.getItem(context, info, data.defaultPreset);
        },
        presets(data, args, context, info) {
            return Promise.all(data.presets.map(id => context.data.worker.item.getItem(context, info, id)));
        }
    },
    ItemSlot: {
        name(data, ags, context, info) {
            return context.data.worker.handbook.getLocale(data.name, context, info);
        }
    },
    ContainedItem: {
        item(data, args, context, info) {
            if (data.contains) return context.data.worker.item.getItem(context, info, data.item, data.contains);
            return context.data.worker.item.getItem(context, info, data.item);
        },
        quantity(data, args, context) {
            return data.count;
        }
    },
    ArmorMaterial: {
        name(data, args, context, info) {
            return context.data.worker.handbook.getLocale(data.name, context, info);
        }
    },
    FleaMarket: {
        name(data, args, context, info) {
            return context.data.worker.item.getLocale(data.name, context, info);
        }
    },
    Mastering: {
        weapons(data, args, context, info) {
            return Promise.all(data.weapons.map(id => context.data.worker.item.getItem(context, info, id)));
        },
    },
    RequirementItem: {
        item(data, args, context, info) {
            return context.data.worker.item.getItem(context, info, data.item);
        },
        quantity(data) {
            return data.count;
        }
    },
    Skill: {
        name(data, args, context, info) {
            return context.data.worker.handbook.getLocale(data.name, context, info);
        }
    },
    StimEffect: {
        type(data, args, context, info) {
            return context.data.worker.handbook.getLocale(data.type, context, info);
        },
        skill(data, args, context, info) {
            return context.data.worker.handbook.getSkill(context, info, data.skillName);
        },
        skillName(data, args, context, info) {
            return context.data.worker.handbook.getLocale(data.skillName, context, info);
        }
    },
    Vendor: {
        __resolveType(data, args, context) {
            if (data.trader) return 'TraderOffer';
            return 'FleaMarket';
        }
    }
};
