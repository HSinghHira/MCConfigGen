import React, { useState, useMemo, useEffect } from 'react';
import { type MinecraftEnchantment, type EnchantmentCategory, loadEnchantments, getCompatibleEnchantments, searchEnchantments, findEnchantmentById } from '@/lib/data/enchantments.ts';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Check, Plus, Trash2, Info } from 'lucide-react';

interface EnchantmentSelectorProps {
  value?: Record<string, number>; // enchantId -> level
  onChange: (value: Record<string, number>) => void;
  category?: EnchantmentCategory; // Filter by category
  className?: string;
}

export const EnchantmentSelector: React.FC<EnchantmentSelectorProps> = ({
  value = {},
  onChange,
  category,
  className = ''
}) => {
  const [open, setOpen] = useState(false);
  const [enchantments, setEnchantments] = useState<MinecraftEnchantment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    loadEnchantments()
      .then((loadedEnchantments: MinecraftEnchantment[]) => {
        if(mounted) {
            setEnchantments(loadedEnchantments);
            setLoading(false);
        }
      })
      .catch((error: Error) => {
        console.error('Error loading enchantments:', error);
        if(mounted) setLoading(false);
      });
    return () => { mounted = false; };
  }, []);

  const availableEnchantments = useMemo(() => {
    if (!enchantments || enchantments.length === 0) return [];

    const currentEnchantmentIds = Object.keys(value);
    
    return getCompatibleEnchantments(
      enchantments,
      currentEnchantmentIds,
      category
    );
  }, [enchantments, value, category]);

  const handleAdd = (id: string) => {
    const newValue = { ...value, [id]: 1 };
    onChange(newValue);
    setOpen(false);
  };

  const handleRemove = (id: string) => {
    const newValue = { ...value };
    delete newValue[id];
    onChange(newValue);
  };

  const handleLevelChange = (id: string, level: number) => {
    if (level < 1) level = 1;
    if (level > 255) level = 255;
    const newValue = { ...value, [id]: level };
    onChange(newValue);
  };

  const activeEnchants = useMemo(() => {
    return Object.entries(value).map(([id, level]) => {
      const data = findEnchantmentById(enchantments, id);
      return { id, level, data };
    });
  }, [value, enchantments]);

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex justify-between items-center">
         <Label>Enchantments</Label>
         <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1 h-8">
                    <Plus className="w-3.5 h-3.5" />
                    Add Enchantment
                </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0 w-[300px]" align="end">
                <Command>
                    <CommandInput placeholder="Search enchantments..." />
                    <CommandList>
                        <CommandEmpty>No enchantment found.</CommandEmpty>
                        <CommandGroup>
                            {availableEnchantments.map((ench) => (
                                <CommandItem
                                    key={ench.id}
                                    value={ench.name}
                                    onSelect={() => handleAdd(ench.id)}
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 w-4 h-4",
                                            value[ench.id] ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                    <div className="flex flex-col">
                                        <span>{ench.name}</span>
                                        {ench.description && (
                                            <span className="text-muted-foreground text-xs">{ench.description}</span>
                                        )}
                                    </div>
                                    {(ench.curse || ench.treasureOnly) && (
                                        <div className="flex gap-1 ml-auto">
                                            {ench.curse && <Badge variant="destructive" className="px-1 h-5 text-[10px]">Curse</Badge>}
                                            {ench.treasureOnly && <Badge variant="secondary" className="px-1 h-5 text-[10px]">Treasure</Badge>}
                                        </div>
                                    )}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
         </Popover>
      </div>

      <div className="space-y-2">
        {activeEnchants.length > 0 ? (
          activeEnchants.map(({ id, level, data }) => (
            <div key={id} className="flex items-center gap-3 bg-card p-2 border rounded-md">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                    <span className="font-medium truncate">{data?.name || id}</span>
                    {data?.curse && <Badge variant="destructive" className="px-1 h-5 text-[10px]">Curse</Badge>}
                    {data?.treasureOnly && <Badge variant="secondary" className="px-1 h-5 text-[10px]">Treasure</Badge>}
                </div>
                {data?.description && (
                  <p className="text-muted-foreground text-xs truncate">{data.description}</p>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                 <Label htmlFor={`ench-${id}`} className="sr-only">Level</Label>
                 <Input
                    id={`ench-${id}`}
                    type="number"
                    min="1"
                    max="255"
                    className="w-16 h-8"
                    value={level}
                    onChange={(e) => handleLevelChange(id, parseInt(e.target.value) || 1)}
                 />
                 <span className="w-8 text-muted-foreground text-xs text-right">/ {data?.maxLevel || '?'}</span>
                 <Button
                    variant="ghost"
                    size="icon"
                    className="hover:bg-destructive/10 w-8 h-8 text-destructive hover:text-destructive/90"
                    onClick={() => handleRemove(id)}
                 >
                    <Trash2 className="w-4 h-4" />
                 </Button>
              </div>
            </div>
          ))
        ) : (
          <div className="py-4 border border-dashed rounded-md text-muted-foreground text-sm text-center">
            No enchantments added
          </div>
        )}
      </div>
    </div>
  );
};