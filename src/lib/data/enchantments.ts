export type EnchantmentCategory =
  | 'head_armor'
  | 'torso_armor'
  | 'leg_armor'
  | 'foot_armor'
  | 'armor'
  | 'weapon'
  | 'sword'
  | 'digger'
  | 'fishing_rod'
  | 'trident'
  | 'breakable'
  | 'bow'
  | 'equippable'
  | 'crossbow'
  | 'vanishable';

export interface MinecraftEnchantment {
  id: string; // Minecraft ID (e.g., sharpness)
  name: string; // Display Name
  maxLevel: number;
  category: EnchantmentCategory;
  treasureOnly: boolean;
  curse: boolean;
  exclude: string[]; // IDs of conflicting enchantments
  weight: number;
  tradeable: boolean;
  discoverable: boolean;
  description?: string;
}

interface EnchantmentJson {
  id: number;
  name: string;
  displayName: string;
  maxLevel: number;
  minCost: { a: number; b: number };
  maxCost: { a: number; b: number };
  treasureOnly: boolean;
  curse: boolean;
  exclude: string[];
  category: string;
  weight: number;
  tradeable: boolean;
  discoverable: boolean;
}

let enchantmentsCache: MinecraftEnchantment[] | null = null;

export async function loadEnchantments(): Promise<MinecraftEnchantment[]> {
  if (enchantmentsCache) {
    return enchantmentsCache;
  }

  try {
    const response = await fetch('/data/enchantments.json');
    const data: EnchantmentJson[] = await response.json();
    
    enchantmentsCache = data.map(ench => ({
      id: ench.name,
      name: ench.displayName,
      maxLevel: ench.maxLevel,
      category: ench.category as EnchantmentCategory,
      treasureOnly: ench.treasureOnly,
      curse: ench.curse,
      exclude: ench.exclude,
      weight: ench.weight,
      tradeable: ench.tradeable,
      discoverable: ench.discoverable,
      description: generateDescription(ench)
    }));
    
    return enchantmentsCache;
  } catch (error) {
    console.error('Failed to load enchantments:', error);
    return [];
  }
}

function generateDescription(ench: EnchantmentJson): string {
  // Generate basic descriptions based on enchantment names
  const descriptions: Record<string, string> = {
    'aqua_affinity': 'Increases underwater mining speed',
    'bane_of_arthropods': 'Increases damage against arthropod mobs',
    'binding_curse': 'Prevents removal of armor',
    'blast_protection': 'Reduces explosion damage',
    'breach': 'Reduces enemy armor effectiveness',
    'channeling': 'Summons lightning during thunderstorms',
    'density': 'Increases mace damage based on fall distance',
    'depth_strider': 'Increases underwater movement speed',
    'efficiency': 'Increases mining speed',
    'feather_falling': 'Reduces fall damage',
    'fire_aspect': 'Sets targets on fire',
    'fire_protection': 'Reduces fire damage',
    'flame': 'Arrows set targets on fire',
    'fortune': 'Increases block drops',
    'frost_walker': 'Creates frosted ice when walking on water',
    'impaling': 'Increases damage against aquatic mobs',
    'infinity': 'Shooting consumes no arrows',
    'knockback': 'Increases knockback',
    'looting': 'Increases mob loot drops',
    'loyalty': 'Trident returns after being thrown',
    'luck_of_the_sea': 'Increases fishing luck',
    'lure': 'Decreases fishing wait time',
    'mending': 'Repairs item using XP orbs',
    'multishot': 'Shoots 3 arrows at once',
    'piercing': 'Arrows pierce through entities',
    'power': 'Increases arrow damage',
    'projectile_protection': 'Reduces projectile damage',
    'protection': 'Reduces most types of damage',
    'punch': 'Increases arrow knockback',
    'quick_charge': 'Decreases crossbow charging time',
    'respiration': 'Extends underwater breathing time',
    'riptide': 'Trident propels user when thrown',
    'sharpness': 'Increases melee damage',
    'silk_touch': 'Mined blocks drop themselves',
    'smite': 'Increases damage against undead mobs',
    'soul_speed': 'Increases movement speed on soul sand/soil',
    'sweeping_edge': 'Increases sweeping attack damage',
    'swift_sneak': 'Increases sneaking speed',
    'thorns': 'Damages attackers',
    'unbreaking': 'Increases item durability',
    'vanishing_curse': 'Item disappears on death',
    'wind_burst': 'Emits wind burst on hit'
  };

  return descriptions[ench.name] || 'Enchantment effect';
}

export function getEnchantmentsByCategory(enchantments: MinecraftEnchantment[], category: EnchantmentCategory): MinecraftEnchantment[] {
  if (!enchantments || enchantments.length === 0) return [];
  return enchantments.filter(e => e.category === category);
}

export function searchEnchantments(enchantments: MinecraftEnchantment[], query: string): MinecraftEnchantment[] {
  if (!enchantments || enchantments.length === 0 || !query) return [];
  
  const lowerQuery = query.toLowerCase();
  return enchantments.filter(e =>
    e.name?.toLowerCase().includes(lowerQuery) ||
    e.id?.toLowerCase().includes(lowerQuery) ||
    e.description?.toLowerCase().includes(lowerQuery)
  );
}

export function findEnchantmentById(enchantments: MinecraftEnchantment[], id: string): MinecraftEnchantment | undefined {
  if (!enchantments || enchantments.length === 0 || !id) return undefined;
  return enchantments.find(e => e.id === id);
}

// Helper to get compatible enchantments (excluding conflicts)
export function getCompatibleEnchantments(
  enchantments: MinecraftEnchantment[],
  currentEnchantments: string[],
  category?: EnchantmentCategory
): MinecraftEnchantment[] {
  if (!enchantments || enchantments.length === 0) return [];
  
  let filtered = category 
    ? getEnchantmentsByCategory(enchantments, category)
    : enchantments;

  // Filter out enchantments that conflict with current ones
  return filtered.filter(ench => {
    // Don't show already applied enchantments
    if (currentEnchantments.includes(ench.id)) return false;
    
    // Check if any current enchantment conflicts with this one
    for (const currentId of currentEnchantments) {
      const currentEnch = findEnchantmentById(enchantments, currentId);
      if (currentEnch?.exclude.includes(ench.id) || ench.exclude.includes(currentId)) {
        return false;
      }
    }
    
    return true;
  });
}

// Legacy compatibility - kept for backward compatibility
export const enchantments: MinecraftEnchantment[] = [];

export function getEnchantmentsByTarget(target: string): MinecraftEnchantment[] {
  console.warn('getEnchantmentsByTarget is deprecated. Use loadEnchantments() and getEnchantmentsByCategory() instead.');
  return [];
}