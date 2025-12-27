import { materials } from '@/lib/data/materials';

export class MinecraftUtils {
    static isValidMaterial(material: string): boolean {
        return materials.some(m => m.id === material);
    }

    static formatMaterialName(material: string): string {
        return material
            .toLowerCase()
            .split('_')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }

    static ticksToSeconds(ticks: number): number {
        return ticks / 20;
    }

    static secondsToTicks(seconds: number): number {
        return Math.floor(seconds * 20);
    }
}
