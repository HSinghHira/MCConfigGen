export type MaterialCategory =
  | 'building_blocks'
  | 'decorations'
  | 'redstone'
  | 'transportation'
  | 'misc'
  | 'food'
  | 'tools'
  | 'combat'
  | 'brewing';

export interface MinecraftMaterial {
  id: string; // The Minecraft item ID (e.g., diamond_sword)
  name: string; // Display name
  category: MaterialCategory;
  stackable: boolean;
  maxStackSize: number;
  imgSrc?: string; // Base64 image data
  imgAlt?: string;
}

interface MinecraftItemJson {
  displayName: string;
  itemId: string;
  damageValue: string;
  stackSize: string;
  imgAlt: string;
  imgSrc: string;
}

interface MinecraftItemsData {
  metadata: {
    lastUpdated: string;
    totalItems: number;
    source: string;
  };
  items: MinecraftItemJson[];
}

// Category mapping based on item names/IDs
const CATEGORY_KEYWORDS: Record<MaterialCategory, string[]> = {
  building_blocks: ['stone', 'granite', 'diorite', 'andesite', 'dirt', 'grass', 'sand', 'gravel', 'wood', 'log', 'plank', 'brick', 'concrete', 'terracotta', 'cobblestone', 'prismarine'],
  decorations: ['flower', 'carpet', 'banner', 'painting', 'frame', 'pot', 'candle', 'lantern', 'torch', 'glass', 'pane', 'fence', 'wall', 'slab', 'stair', 'door', 'trapdoor', 'sign'],
  redstone: ['redstone', 'repeater', 'comparator', 'piston', 'dispenser', 'dropper', 'hopper', 'observer', 'lever', 'button', 'pressure_plate', 'rail', 'detector'],
  transportation: ['rail', 'minecart', 'boat', 'saddle', 'horse_armor', 'elytra'],
  food: ['apple', 'bread', 'carrot', 'potato', 'beef', 'pork', 'chicken', 'mutton', 'fish', 'salmon', 'cod', 'melon', 'berry', 'cookie', 'cake', 'pie', 'stew', 'soup'],
  tools: ['pickaxe', 'axe', 'shovel', 'hoe', 'shears', 'flint_and_steel', 'fishing_rod', 'bucket'],
  combat: ['sword', 'bow', 'crossbow', 'arrow', 'helmet', 'chestplate', 'leggings', 'boots', 'shield', 'trident'],
  brewing: ['potion', 'bottle', 'brewing_stand', 'cauldron', 'blaze_powder', 'spider_eye', 'fermented', 'magma_cream', 'ghast_tear'],
  misc: [] // Catch-all
};

function categorizeItem(itemId: string, displayName: string): MaterialCategory {
  const searchText = `${itemId} ${displayName}`.toLowerCase();
  
  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (keywords.some(keyword => searchText.includes(keyword))) {
      return category as MaterialCategory;
    }
  }
  
  return 'misc';
}

let materialsCache: MinecraftMaterial[] | null = null;

export async function loadMaterials(): Promise<MinecraftMaterial[]> {
  if (materialsCache) {
    return materialsCache;
  }

  try {
    const response = await fetch('/data/minecraft-items.json');
    const data: MinecraftItemsData = await response.json();
    
    materialsCache = data.items.map(item => ({
      id: item.itemId.toUpperCase(), // Convert to uppercase for consistency
      name: item.displayName,
      category: categorizeItem(item.itemId, item.displayName),
      stackable: parseInt(item.stackSize) > 1,
      maxStackSize: parseInt(item.stackSize),
      imgSrc: item.imgSrc,
      imgAlt: item.imgAlt
    }));
    
    return materialsCache;
  } catch (error) {
    console.error('Failed to load materials:', error);
    return [];
  }
}

export function getMaterialsByCategory(materials: MinecraftMaterial[], category: MaterialCategory): MinecraftMaterial[] {
  if (!materials || materials.length === 0) return [];
  return materials.filter(m => m.category === category);
}

export function searchMaterials(materials: MinecraftMaterial[], query: string): MinecraftMaterial[] {
  if (!materials || materials.length === 0) return [];
  
  const lowerQuery = query.toLowerCase();
  return materials.filter(m =>
    m.name?.toLowerCase().includes(lowerQuery) ||
    m.id?.toLowerCase().includes(lowerQuery)
  );
}

export function findMaterialById(materials: MinecraftMaterial[], id: string): MinecraftMaterial | undefined {
  if (!materials || materials.length === 0 || !id) return undefined;
  return materials.find(m => m.id === id);
}