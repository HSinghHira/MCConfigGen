import { YamlBuilder } from '@/lib/generators/shared/yaml-builder';
import type { PlayerKitsConfig, Kit, KitItem, DisplayItem, Requirements, ActionDetails, ItemFlag } from './types';

export class PlayerKitsYamlGenerator {
    static generate(config: PlayerKitsConfig): string {
        const yamlStructure: Record<string, any> = {};

        Object.entries(config.kits).forEach(([key, kit]) => {
            const kitData: Record<string, any> = {};

            // Top level settings
            if (kit.cooldown !== undefined) kitData.cooldown = kit.cooldown;
            if (kit.permission_required !== undefined) kitData.permission_required = kit.permission_required;
            if (kit.custom_permission) kitData.custom_permission = kit.custom_permission;
            if (kit.one_time !== undefined) kitData.one_time = kit.one_time;
            if (kit.auto_armor !== undefined) kitData.auto_armor = kit.auto_armor;
            if (kit.auto_offhand !== undefined) kitData.auto_offhand = kit.auto_offhand;
            if (kit.clear_inventory !== undefined) kitData.clear_inventory = kit.clear_inventory;
            if (kit.save_original_items !== undefined) kitData.save_original_items = kit.save_original_items;
            if (kit.allow_placeholders_on_original_items !== undefined)
                kitData.allow_placeholders_on_original_items = kit.allow_placeholders_on_original_items;

            // Display section
            if (kit.display) {
                const display: Record<string, any> = {};

                if (kit.display.default) display.default = this.mapItem(kit.display.default);
                if (kit.display.no_permission) display.no_permission = this.mapItem(kit.display.no_permission);
                if (kit.display.cooldown) display.cooldown = this.mapItem(kit.display.cooldown);
                if (kit.display.one_time) display.one_time = this.mapItem(kit.display.one_time);
                if (kit.display.one_time_requirements) display.one_time_requirements = this.mapItem(kit.display.one_time_requirements);

                if (Object.keys(display).length > 0) {
                    kitData.display = display;
                }
            }

            // Requirements section
            if (kit.requirements) {
                const reqs: Record<string, any> = {};

                if (kit.requirements.one_time !== undefined) reqs.one_time_requirements = kit.requirements.one_time;
                if (kit.requirements.price !== undefined && kit.requirements.price > 0) reqs.price = kit.requirements.price;
                if (kit.requirements.extra_requirements && kit.requirements.extra_requirements.length > 0) {
                    reqs.extra_requirements = kit.requirements.extra_requirements;
                }
                if (kit.requirements.message && kit.requirements.message.length > 0) {
                    reqs.message = kit.requirements.message;
                }

                if (Object.keys(reqs).length > 0) {
                    kitData.requirements = reqs;
                }
            }

            // Items - MAP style (1, 2, 3...)
            if (kit.items && kit.items.length > 0) {
                const items: Record<number, any> = {};
                kit.items.forEach((item, index) => {
                    items[index + 1] = this.mapItem(item);
                });
                kitData.items = items;
            }

            // Actions - MAP style
            const actions: Record<string, any> = {};
            if (kit.claim_actions && kit.claim_actions.length > 0) {
                const claim: Record<number, any> = {};
                kit.claim_actions.forEach((act, index) => {
                    claim[index + 1] = this.mapAction(act);
                });
                actions.claim = claim;
            }
            if (kit.error_actions && kit.error_actions.length > 0) {
                const error: Record<number, any> = {};
                kit.error_actions.forEach((act, index) => {
                    error[index + 1] = this.mapAction(act);
                });
                actions.error = error;
            }

            if (Object.keys(actions).length > 0) {
                kitData.actions = actions;
            }

            yamlStructure[key] = kitData;
        });

        const firstKitKey = Object.keys(yamlStructure)[0];
        if (firstKitKey) {
            return YamlBuilder.toString(yamlStructure[firstKitKey]);
        }

        return "";
    }

    private static mapAction(details: ActionDetails): any {
        const data: any = {
            action: details.action
        };
        if (details.execute_before_items) data.execute_before_items = true;
        if (details.count_as_item) data.count_as_item = true;
        return data;
    }

    private static mapItem(item: KitItem): any {
        const itemData: any = {
            id: item.material,
            amount: item.amount > 0 ? item.amount : 1
        };

        if (item.name) itemData.name = item.name;
        if (item.durability !== undefined) itemData.durability = item.durability;
        if (item.custom_model_data !== undefined) itemData.custom_model_data = item.custom_model_data;

        // Lore
        if (item.lore && item.lore.length > 0) itemData.lore = item.lore;

        // Enchantments - Changed to 'enchants' per documentation
        if (item.enchantments && item.enchantments.length > 0) {
            itemData.enchants = item.enchantments;
        }

        // Flags
        if (item.unbreakable) itemData.unbreakable = true;
        if (item.offhand) itemData.offhand = true;
        if (item.item_flags && item.item_flags.length > 0) {
            itemData.item_flags = item.item_flags;
        }

        // Color (for leather armor or potions)
        if (item.color !== undefined) {
            itemData.color = item.color;
        }

        // Skull Data
        if (item.skull_data) {
            const skull: Record<string, string> = {};
            if (item.skull_data.texture) skull.texture = item.skull_data.texture;
            if (item.skull_data.owner) skull.owner = item.skull_data.owner;
            if (Object.keys(skull).length > 0) {
                itemData.skull_data = skull;
            }
        }

        // Armor Trim
        if (item.armor_trim) {
            itemData.trim_data = {
                pattern: item.armor_trim.pattern,
                material: item.armor_trim.material
            };
        }

        // Potion Data
        if (item.potion_data) {
            const potion: Record<string, any> = {};
            if (item.potion_data.effects) potion.effects = item.potion_data.effects;
            if (item.potion_data.extended !== undefined) potion.extended = item.potion_data.extended;
            if (item.potion_data.upgraded !== undefined) potion.upgraded = item.potion_data.upgraded;
            if (item.potion_data.type) potion.type = item.potion_data.type;
            if (item.potion_data.color !== undefined) potion.color = item.potion_data.color;
            itemData.potion_data = potion;
        }

        // Banner Data
        if (item.banner_data) {
            itemData.banner_data = {
                patterns: item.banner_data.patterns
            };
        }

        // Firework Data
        if (item.firework_data) {
            const firework: Record<string, any> = {};
            if (item.firework_data.rocket_effects) firework.rocket_effects = item.firework_data.rocket_effects;
            if (item.firework_data.power !== undefined) firework.power = item.firework_data.power;
            if (item.firework_data.star_effect) firework.star_effect = item.firework_data.star_effect;
            itemData.firework_data = firework;
        }

        // Book Data
        if (item.book_data) {
            const book: Record<string, any> = {};
            if (item.book_data.title) book.title = item.book_data.title;
            if (item.book_data.author) book.author = item.book_data.author;
            if (item.book_data.generation) book.generation = item.book_data.generation;
            if (item.book_data.pages) book.pages = item.book_data.pages;
            itemData.book_data = book;
        }

        // 1.20.6+ / 1.21+ fields
        if (item.hide_tooltip !== undefined) itemData.hide_tooltip = item.hide_tooltip;
        if (item.tooltip_style) itemData.tooltip_style = item.tooltip_style;
        if (item.model) itemData.model = item.model;
        if (item.custom_model_component_data) {
            const cmd: Record<string, any> = {};
            if (item.custom_model_component_data.strings) cmd.strings = item.custom_model_component_data.strings;
            if (item.custom_model_component_data.flags) cmd.flags = item.custom_model_component_data.flags;
            if (item.custom_model_component_data.floats) cmd.floats = item.custom_model_component_data.floats;
            if (item.custom_model_component_data.colors) cmd.colors = item.custom_model_component_data.colors;
            itemData.custom_model_component_data = cmd;
        }

        // Preview Slot
        if (item.preview_slot !== undefined) itemData.preview_slot = item.preview_slot;

        // NBT (1.8 - 1.20.4 only)
        if (item.nbt) {
            itemData.nbt = item.nbt;
        }

        return itemData;
    }
}
