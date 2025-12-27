import React, { useState, useEffect } from "react";
import {
  type MinecraftMaterial,
  loadMaterials,
  findMaterialById,
} from "@/lib/data/materials";
import { cn } from "@/lib/utils";
import { Package, Loader2 } from "lucide-react";

interface MaterialIconProps {
  material: string;
  className?: string;
  size?: number;
}

export const MaterialIcon: React.FC<MaterialIconProps> = ({
  material,
  className,
  size = 24,
}) => {
  const [materials, setMaterials] = useState<MinecraftMaterial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    loadMaterials()
      .then((loadedMaterials) => {
        if (mounted) {
          setMaterials(loadedMaterials);
          setLoading(false);
        }
      })
      .catch((error) => {
        console.error("Error loading materials for icon:", error);
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const selectedMaterial =
    material && materials.length > 0
      ? findMaterialById(materials, material.toUpperCase())
      : null;

  if (loading) {
    return (
      <div className={cn("flex justify-center items-center", className)}>
        <Loader2 className="opacity-20 animate-spin" size={size * 0.8} />
      </div>
    );
  }

  if (selectedMaterial?.imgSrc) {
    return (
      <img
        src={selectedMaterial.imgSrc}
        alt={selectedMaterial.name}
        className={cn("object-contain pixelated", className)}
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <div
      className={cn(
        "flex justify-center items-center bg-muted/30 rounded-sm",
        className
      )}
      style={{ width: size, height: size }}
    >
      <Package className="opacity-20" size={size * 0.8} />
    </div>
  );
};
