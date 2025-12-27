import React, { useState, useEffect } from 'react';
import { ColorCodePicker } from './ColorCodePicker';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Bold, Italic } from 'lucide-react';

interface TextFormatterProps {
    value: string;
    onChange: (value: string) => void;
    label?: string;
    className?: string;
}

export const TextFormatter: React.FC<TextFormatterProps> = ({
    value,
    onChange,
    label = 'Text',
    className = ''
}) => {
    const [activeTab, setActiveTab] = useState('simple');
    const [gradientStart, setGradientStart] = useState('#55FFFF');
    const [gradientEnd, setGradientEnd] = useState('#5555FF');
    const [bold, setBold] = useState(false);
    const [italic, setItalic] = useState(false);

    // Simple color picker state
    const [selectedColorCode, setSelectedColorCode] = useState('f');

    const handleSimpleChange = (text: string) => {
        // Preserve existing color code if present
        const cleanText = text.replace(/&[0-9a-fk-or]/g, '');
        let newText = text;

        if (activeTab === 'simple') {
            let prefix = `&${selectedColorCode}`;
            if (bold) prefix += '&l';
            if (italic) prefix += '&o';

            // Only apply if there isn't already formatting
            if (!text.startsWith('&')) {
                newText = prefix + cleanText;
            }
        }

        onChange(newText);
    };

    const applyFormatting = () => {
        const cleanText = value.replace(/&[0-9a-fk-or]/g, '');
        if (!cleanText) return;

        if (activeTab === 'simple') {
            let prefix = `&${selectedColorCode}`;
            if (bold) prefix += '&l';
            if (italic) prefix += '&o';
            onChange(prefix + cleanText);
        } else {
            // Basic gradient simulation for preview (actual gradient generation logic would be complex)
            // For now, we'll just wrap it in a hex format placeholder or similar
            // Implementing full RGB gradient generator is complex, keeping it simple for MVP
            const hexStart = `&#${gradientStart.replace('#', '')}`;
            const hexEnd = `&#${gradientEnd.replace('#', '')}`;
            onChange(`${hexStart}${cleanText}${hexEnd}`);
        }
    };

    // Update formatting when options change
    useEffect(() => {
        // Only auto-update if value looks like it's being managed
        if (value && !value.includes(' ')) {
            applyFormatting();
        }
    }, [selectedColorCode, bold, italic, gradientStart, gradientEnd]);

    return (
        <div className={cn("space-y-4", className)}>
            {label && <Label>{label}</Label>}

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid grid-cols-2 w-full">
                    <TabsTrigger value="simple">Simple Color</TabsTrigger>
                    <TabsTrigger value="gradient">RGB Gradient</TabsTrigger>
                </TabsList>

                <TabsContent value="simple" className="space-y-2 py-4">
                    <ColorCodePicker
                        value={selectedColorCode}
                        onChange={setSelectedColorCode}
                        allowFormats={false}
                        label="Color"
                    />
                </TabsContent>

                <TabsContent value="gradient" className="space-y-4 py-4">
                    <div className="gap-4 grid grid-cols-2">
                        <div className="space-y-2">
                            <Label>Start Color</Label>
                            <div className="flex gap-2">
                                <Input
                                    type="color"
                                    value={gradientStart}
                                    onChange={(e) => setGradientStart(e.target.value)}
                                    className="p-1 w-12 h-10"
                                />
                                <Input 
                                    value={gradientStart}
                                    onChange={(e) => setGradientStart(e.target.value)}
                                    className="flex-1"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>End Color</Label>
                            <div className="flex gap-2">
                                <Input
                                    type="color"
                                    value={gradientEnd}
                                    onChange={(e) => setGradientEnd(e.target.value)}
                                    className="p-1 w-12 h-10"
                                />
                                <Input 
                                    value={gradientEnd}
                                    onChange={(e) => setGradientEnd(e.target.value)}
                                    className="flex-1"
                                />
                            </div>
                        </div>
                    </div>
                </TabsContent>
            </Tabs>

            <div className="flex gap-2">
                 <Button
                    variant={bold ? "default" : "outline"}
                    size="icon"
                    onClick={() => setBold(!bold)}
                    title="Bold"
                >
                    <Bold className="w-4 h-4" />
                </Button>
                <Button
                    variant={italic ? "default" : "outline"}
                    size="icon"
                    onClick={() => setItalic(!italic)}
                    title="Italic"
                >
                    <Italic className="w-4 h-4" />
                </Button>
                 <Input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder="Enter text..."
                    className="flex-1"
                />
            </div>

            <div className="bg-black/80 p-3 border rounded-md min-h-[40px]">
                <div className="mb-1 text-muted-foreground text-xs">Preview:</div>
                <div
                    className="font-minecraft text-lg leading-none"
                    dangerouslySetInnerHTML={{
                        __html: parseMinecraftColors(value)
                    }}
                />
            </div>
        </div>
    );
};

// Simple visual parser for preview
function parseMinecraftColors(text: string): string {
    if (!text) return '';

    let result = text
        .replace(/&0/g, '<span style="color:#000000">')
        .replace(/&1/g, '<span style="color:#0000AA">')
        .replace(/&2/g, '<span style="color:#00AA00">')
        .replace(/&3/g, '<span style="color:#00AAAA">')
        .replace(/&4/g, '<span style="color:#AA0000">')
        .replace(/&5/g, '<span style="color:#AA00AA">')
        .replace(/&6/g, '<span style="color:#FFAA00">')
        .replace(/&7/g, '<span style="color:#AAAAAA">')
        .replace(/&8/g, '<span style="color:#555555">')
        .replace(/&9/g, '<span style="color:#5555FF">')
        .replace(/&a/g, '<span style="color:#55FF55">')
        .replace(/&b/g, '<span style="color:#55FFFF">')
        .replace(/&c/g, '<span style="color:#FF5555">')
        .replace(/&d/g, '<span style="color:#FF55FF">')
        .replace(/&e/g, '<span style="color:#FFFF55">')
        .replace(/&f/g, '<span style="color:#FFFFFF">')
        .replace(/&l/g, '<span style="font-weight:bold">')
        .replace(/&o/g, '<span style="font-style:italic">')
        .replace(/&n/g, '<span style="text-decoration:underline">')
        .replace(/&m/g, '<span style="text-decoration:line-through">')
        .replace(/&r/g, '</span></span></span></span>'); // Close active spans effectively

    // Add closing tags hackily
    const openTags = (result.match(/<span/g) || []).length;
    result += '</span>'.repeat(openTags);

    return result;
}
