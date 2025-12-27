export interface PlayerKitsConfig {
  kits: Record<string, Kit>;
}

export type ItemFlag =
  | 'HIDE_ENCHANTS'
  | 'HIDE_ATTRIBUTES'
  | 'HIDE_UNBREAKABLE'
  | 'HIDE_DESTROYS'
  | 'HIDE_PLACED_ON'
  | 'HIDE_POTION_EFFECTS'
  | 'HIDE_DYE'
  | 'HIDE_ARMOR_TRIM'
  | 'HIDE_ADDITIONAL_TOOLTIP';

export interface SkullData {
  owner?: string;
  uuid?: string;
  texture?: string;
}

export interface ArmorTrim {
  pattern: string;
  material: string;
}

export interface PotionData {
  effects?: string[]; // Format: "<effect>;<level>;<duration>"
  extended?: boolean;
  upgraded?: boolean;
  type?: string;
  color?: number;
}

export interface BannerData {
  patterns: string[]; // Format: "<color>;<pattern>"
}

export interface FireworkData {
  rocket_effects?: string[]; // Format for rocket item
  power?: number;
  star_effect?: string; // Format for star item
}

export interface BookData {
  title?: string;
  author?: string;
  generation?: string;
  pages?: string[];
}

export interface CustomModelComponentData {
  strings?: string[];
  flags?: string[];
  floats?: number[];
  colors?: number[];
}

export interface KitItem {
  material: string;
  amount: number;
  durability?: number; // Damage value
  name?: string;
  lore?: string[];
  enchantments?: string[]; // Format: "enchantment:level"
  unbreakable?: boolean;
  item_flags?: ItemFlag[];
  custom_model_data?: number;
  color?: string | number; // For leather armor or potion color
  skull_data?: SkullData;
  armor_trim?: ArmorTrim;
  potion_data?: PotionData;
  banner_data?: BannerData;
  firework_data?: FireworkData;
  book_data?: BookData;
  // 1.20.6+ / 1.21+ fields
  hide_tooltip?: boolean;
  tooltip_style?: string;
  model?: string;
  custom_model_component_data?: CustomModelComponentData;
  nbt?: string; // Raw NBT string or JSON
  chance?: number; // 0-100
  offhand?: boolean;
  preview_slot?: number;
}

export interface Requirements {
  price?: number;
  one_time?: boolean;
  block_if_no_space?: boolean; // Sometimes used, adding just in case for future or remove if not needed. Keeping strict to request for now.
  // Using extra_requirements as string list as requested
  extra_requirements?: string[];
  // Message override
  message?: string[];
  // Legacy or other conditions
  conditions?: string[];
}

export interface DisplayItem extends KitItem {
  // Inherits all item properties
}

export interface DisplayData {
  default?: DisplayItem;
  no_permission?: DisplayItem;
  cooldown?: DisplayItem;
  one_time?: DisplayItem;
  one_time_requirements?: DisplayItem;
}

export interface ActionDetails {
  action: string;
  execute_before_items?: boolean;
  count_as_item?: boolean;
}

export interface Kit {
  name?: string; // internal key
  display_name?: string; // used for simple renaming if needed, but usually items have names

  // Basic Settings
  cooldown?: number; // seconds
  permission?: string;
  slot?: number;

  // Advanced Settings from request
  permission_required?: boolean;
  custom_permission?: string;
  one_time?: boolean;
  auto_armor?: boolean;
  auto_offhand?: boolean;
  clear_inventory?: boolean;
  save_original_items?: boolean;
  allow_placeholders_on_original_items?: boolean;

  // Items - using array in Types for easier UI handling, but will generate as map
  items: KitItem[];

  // Actions - using array in Types for easier UI handling
  claim_actions?: ActionDetails[];
  error_actions?: ActionDetails[];

  // Requirements
  requirements?: Requirements;

  // Display (GUI Appearance)
  display?: DisplayData;
}

export const DEFAULT_KIT: Kit = {
  items: [],
  cooldown: 0,
  auto_armor: true,
  display: {
    default: {
      material: 'DIAMOND_SWORD',
      name: '&eStarter Kit',
      amount: 1
    }
  }
};
