import React, { useState } from 'react';
import type { DisplayData, DisplayItem } from '@/lib/generators/playerkits/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';

interface DisplayItemsEditorProps {
    displayData?: DisplayData;
    onChange: (data: DisplayData) => void;
}

const DEFAULT_DISPLAY_ITEM: DisplayItem = {
    material: 'DIAMOND',
    amount: 1,
    name: '&eStarter Kit'
};

export const DisplayItemsEditor: React.FC<DisplayItemsEditorProps> = ({ 
    displayData = {}, 
    onChange 
}) => {
    const [activeState, setActiveState] = useState<keyof DisplayData>('default');

    const updateCurrentItem = (updates: Partial<DisplayItem>) => {
        const currentItem = displayData[activeState] || DEFAULT_DISPLAY_ITEM;
        const newItem = { ...currentItem, ...updates };
        onChange({ ...displayData, [activeState]: newItem });
    };

    const currentItem = displayData[activeState];

    return (
        <div className="space-y-4">
            <Tabs value={activeState} onValueChange={(val) => setActiveState(val as keyof DisplayData)} className="w-full">
                <TabsList className="grid grid-cols-4 w-full">
                    <TabsTrigger value="default">Default</TabsTrigger>
                    <TabsTrigger value="no_permission">No Perm</TabsTrigger>
                    <TabsTrigger value="cooldown">Cooldown</TabsTrigger>
                    <TabsTrigger value="one_time">One Time</TabsTrigger>
                </TabsList>
            </Tabs>

            <Alert className="bg-muted/50 py-2">
                
                <AlertDescription className="text-xs">
                    <Info className="w-4 h-4" /> Configure icon for state: <strong>{activeState.replace('_', ' ')}</strong>
                </AlertDescription>
            </Alert>

            <Card>
                <CardContent className="pt-6">
                    {!currentItem ? (
                        <div className="space-y-4 py-8 text-center">
                            <p className="text-muted-foreground text-sm">No custom display set for {activeState}.</p>
                            <Button size="sm" onClick={() => updateCurrentItem(DEFAULT_DISPLAY_ITEM)}>
                                Enable Custom Display
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="gap-2 grid">
                                <Label className="text-xs">Material</Label>
                                <Input 
                                    className="h-8 text-sm"
                                    type="text"
                                    value={currentItem.material}
                                    onChange={(e) => updateCurrentItem({ material: e.target.value.toUpperCase() })}
                                />
                            </div>
                            <div className="gap-2 grid">
                                <Label className="text-xs">Custom Name</Label>
                                <Input 
                                    className="h-8 text-sm"
                                    type="text"
                                    value={currentItem.name || ''}
                                    onChange={(e) => updateCurrentItem({ name: e.target.value })}
                                />
                            </div>
                            <div className="gap-2 grid">
                                <Label className="text-xs">Lore (one per line)</Label>
                                <Textarea 
                                    className="min-h-[80px] text-sm"
                                    value={(currentItem.lore || []).join('\n')}
                                    onChange={(e) => updateCurrentItem({ lore: e.target.value.split('\n') })}
                                    rows={4}
                                />
                            </div>
                            
                            {activeState !== 'default' && (
                                <Button 
                                    variant="destructive"
                                    size="sm"
                                    className="w-full h-8"
                                    onClick={() => {
                                        const newData = { ...displayData };
                                        delete newData[activeState as keyof DisplayData];
                                        onChange(newData);
                                    }}
                                >
                                    Remove Custom Display
                                </Button>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};
