import React from "react";
import type { KitItem } from "@/lib/generators/playerkits/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Copy, Trash2, Edit, Package } from "lucide-react";
import { MaterialIcon } from "@/components/minecraft/MaterialIcon";

interface ItemsListProps {
  items: KitItem[];
  onUpdate: (items: KitItem[]) => void;
  onEdit: (index: number) => void;
}

export const ItemsList: React.FC<ItemsListProps> = ({
  items,
  onUpdate,
  onEdit,
}) => {
  const handleDelete = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    onUpdate(newItems);
  };

  const handleDuplicate = (index: number) => {
    const item = items[index];
    const newItems = [...items, { ...item }];
    onUpdate(newItems);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-medium text-lg">Kit Items</h3>
        <Button size="sm" onClick={() => onEdit(-1)}>
          <Plus className="mr-2 w-4 h-4" /> Add Item
        </Button>
      </div>

      <div className="gap-4 grid grid-cols-1 md:grid-cols-2">
        {items.length === 0 ? (
          <div className="flex flex-col justify-center items-center col-span-full bg-muted/50 p-8 border border-dashed rounded-lg text-muted-foreground">
            <Package className="opacity-50 mb-2 w-10 h-10" />
            <p>No items added yet. Click "+ Add Item" to start.</p>
          </div>
        ) : (
          items.map((item, index) => (
            <Card
              key={index}
              className="bg-card hover:bg-accent/5 overflow-hidden transition-colors"
            >
              <CardContent className="flex items-center gap-3 p-3">
                <div className="flex justify-center items-center bg-muted rounded-md w-10 h-10 overflow-hidden shrink-0">
                  <MaterialIcon material={item.material} size={28} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">
                    {item.name || item.material}
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground text-xs">
                    <span>x{item.amount}</span>
                    {item.enchantments && item.enchantments.length > 0 && (
                      <Badge
                        variant="secondary"
                        className="px-1 py-0 h-5 text-[10px]"
                      >
                        {item.enchantments.length} Enchants
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-8 h-8"
                    onClick={() => onEdit(index)}
                    title="Edit"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-8 h-8"
                    onClick={() => handleDuplicate(index)}
                    title="Duplicate"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="hover:bg-destructive/10 w-8 h-8 text-destructive hover:text-destructive/90"
                    onClick={() => handleDelete(index)}
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
