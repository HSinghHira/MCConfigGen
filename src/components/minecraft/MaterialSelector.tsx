import React, { useState, useMemo, useEffect } from 'react';
import { type MinecraftMaterial, loadMaterials, searchMaterials, getMaterialsByCategory, findMaterialById, type MaterialCategory } from '@/lib/data/materials';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { Check, ChevronsUpDown, Loader2 } from 'lucide-react';

interface MaterialSelectorProps {
  value?: string;
  onChange: (material: string) => void;
  label?: string;
  className?: string;
}

const CATEGORIES: { label: string; value: MaterialCategory }[] = [
  { label: 'Building Blocks', value: 'building_blocks' },
  { label: 'Decorations', value: 'decorations' },
  { label: 'Redstone', value: 'redstone' },
  { label: 'Transportation', value: 'transportation' },
  { label: 'Food', value: 'food' },
  { label: 'Tools', value: 'tools' },
  { label: 'Combat', value: 'combat' },
  { label: 'Brewing', value: 'brewing' },
  { label: 'Misc', value: 'misc' },
];

export const MaterialSelector: React.FC<MaterialSelectorProps> = ({
  value,
  onChange,
  label = 'Material',
  className = ''
}) => {
  const [open, setOpen] = useState(false);
  const [materials, setMaterials] = useState<MinecraftMaterial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    loadMaterials()
      .then(loadedMaterials => {
        if(mounted) {
            setMaterials(loadedMaterials);
            setLoading(false);
        }
      })
      .catch(error => {
        console.error('Error loading materials:', error);
        if(mounted) setLoading(false);
      });
    return () => { mounted = false; };
  }, []);

  const selectedMaterial = value && materials.length > 0 
    ? findMaterialById(materials, value) 
    : null;

  // We rely on Command's internal filtering or we can filter materials prop passed to command items
  // However, rendering 1000 items in Command might be slow.
  // We should limit the initial render or use virtual list if list is huge.
  // For now, let's just render all. Or maybe just top results if search matches?
  // Replicating search functionality:
  
  return (
    <div className={cn("gap-2 grid", className)}>
      {label && <Label>{label}</Label>}
      
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="justify-between py-2 w-full h-auto"
            disabled={loading}
          >
            {loading ? (
               <span className="flex items-center gap-2 text-muted-foreground">
                 <Loader2 className="w-4 h-4 animate-spin" /> Loading materials...
               </span>
            ) : selectedMaterial ? (
               <span className="flex items-center gap-2 text-left">
                  {selectedMaterial.imgSrc ? (
                    <img 
                      src={selectedMaterial.imgSrc} 
                      alt=""
                      className="w-6 h-6 object-contain pixelated"
                    />
                  ) : (
                    <span className="bg-muted rounded-sm w-6 h-6" />
                  )}
                  <span className="truncate">{selectedMaterial.name}</span>
               </span>
            ) : (
              <span className="text-muted-foreground">Select material...</span>
            )}
            <ChevronsUpDown className="opacity-50 ml-2 w-4 h-4 shrink-0" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0 w-[300px]" align="start">
          <Command>
            <CommandInput placeholder="Search material..." />
            <CommandList>
                <CommandEmpty>No material found.</CommandEmpty>
                <CommandGroup heading="Suggestions">
                    {/* Render a subset or list. Since we have categories, we might want to filter? 
                        Shadcn command filters mostly client side. 
                        If materials is large, we might need to optimize.
                        Let's try rendering simplified list. 
                    */}
                    {materials.slice(0, 100).map((mat) => (
                        <CommandItem
                            key={mat.id}
                            value={mat.name} // Command searches by value (which is text content usually or value prop).
                            // Note: Command matches against value label.
                            onSelect={(currentValue) => {
                                onChange(mat.id);
                                setOpen(false);
                            }}
                            className="flex items-center gap-2"
                        >
                            <Check
                                className={cn(
                                "mr-2 w-4 h-4",
                                value === mat.id ? "opacity-100" : "opacity-0"
                                )}
                            />
                            {mat.imgSrc && (
                                <img src={mat.imgSrc} alt="" className="w-5 h-5 object-contain pixelated" />
                            )}
                            {mat.name}
                        </CommandItem>
                    ))}
                    {materials.length > 100 && (
                        <div className="p-2 text-muted-foreground text-xs text-center">
                            Start typing to search more... (showing first 100)
                        </div>
                    )}
                </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};