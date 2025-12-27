import React, { useState } from 'react';
import { colorCodes, getColorByCode, type MinecraftColor } from '@/lib/data/colorCodes';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';

interface ColorCodePickerProps {
    value: string; // The selected code (e.g., 'a', 'b', 'c')
    onChange: (code: string) => void;
    label?: string;
    allowFormats?: boolean; // Whether to show bold, italic, etc.
    className?: string;
}

export const ColorCodePicker: React.FC<ColorCodePickerProps> = ({
    value,
    onChange,
    label = 'Color',
    allowFormats = true,
    className = ''
}) => {
    const [open, setOpen] = useState(false);
    const selectedColor = getColorByCode(value);

    const colors = colorCodes.filter(c => !c.isFormat);
    const formats = colorCodes.filter(c => c.isFormat);

    return (
        <div className={cn("space-y-2", className)}>
            {label && <Label>{label}</Label>}

            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button variant="outline" className="justify-between w-full">
                        {selectedColor ? (
                            <div className="flex items-center gap-2">
                                <span
                                    className="shadow-sm border rounded-full w-4 h-4"
                                    style={{ backgroundColor: selectedColor.hex || '#000' }}
                                />
                                <span className="mr-1 font-mono text-muted-foreground text-xs">&{selectedColor.code}</span>
                                <span>{selectedColor.name}</span>
                            </div>
                        ) : (
                            <span className="text-muted-foreground">Select color...</span>
                        )}
                        <ChevronDown className="opacity-50 w-4 h-4" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="p-3 w-64" align="start">
                    <div className="gap-4 grid">
                        <div className="space-y-2">
                            <h4 className="font-medium text-muted-foreground text-xs leading-none">Colors</h4>
                            <div className="gap-2 grid grid-cols-5">
                                {colors.map(color => (
                                    <button
                                        key={color.code}
                                        className={cn(
                                            "relative flex justify-center items-center border rounded-md w-8 h-8 hover:scale-110 transition-transform",
                                            value === color.code ? "ring-2 ring-primary" : ""
                                        )}
                                        style={{ backgroundColor: color.hex }}
                                        onClick={() => {
                                            onChange(color.code);
                                            setOpen(false);
                                        }}
                                        title={color.name}
                                    >
                                        <span className="absolute inset-0 flex justify-center items-center opacity-0 hover:opacity-100 drop-shadow-md font-mono font-bold text-[10px] text-white select-none">
                                            &{color.code}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {allowFormats && (
                            <div className="space-y-2">
                                <h4 className="font-medium text-muted-foreground text-xs leading-none">Formats</h4>
                                <div className="gap-2 grid grid-cols-3">
                                    {formats.map(fmt => (
                                        <Button
                                            key={fmt.code}
                                            variant={value === fmt.code ? "default" : "outline"}
                                            size="sm"
                                            className="justify-between px-2 h-7 text-xs"
                                            onClick={() => {
                                                onChange(fmt.code);
                                                setOpen(false);
                                            }}
                                        >
                                            <span className="truncate">{fmt.name}</span>
                                            <span className="opacity-50 font-mono">&{fmt.code}</span>
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    );
};
