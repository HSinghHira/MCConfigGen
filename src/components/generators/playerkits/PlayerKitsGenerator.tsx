import React, { useState, useEffect } from 'react';
import { YAMLPreview } from '@/components/generators/YAMLPreview';
import { BasicSettings } from './BasicSettings';
import { ItemsList } from './ItemsList';
import { ActionsEditor } from './ActionsEditor';
import { RequirementsEditor } from './RequirementsEditor';
import { DisplayItemsEditor } from './DisplayItemsEditor';
import { ItemEditor } from '@/components/minecraft/ItemEditor';

import { PlayerKitsYamlGenerator } from '@/lib/generators/playerkits/yaml-generator';
import type { PlayerKitsConfig, Kit, KitItem, ActionDetails } from '@/lib/generators/playerkits/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import { kitYamlStore, kitNameStore } from '@/lib/generators/playerkits/store';

const INITIAL_KIT: Kit = {
    display_name: 'StarterKit',
    cooldown: 86400,
    items: [],
    auto_armor: true,
    auto_offhand: false,
    permission_required: true,
    custom_permission: "custom_permission",
    one_time: true,
    clear_inventory: true,
    save_original_items: true,
    allow_placeholders_on_original_items: false,
    display: {
        default: { material: 'DIAMOND', amount: 1, name: '&eStarter Kit' }
    },
    claim_actions: [],
    error_actions: [],
    requirements: {
        price: 0,
        one_time: false,
        extra_requirements: [],
        message: []
    }
};

export default function PlayerKitsGenerator() {
    const [activeKitId, setActiveKitId] = useState('StarterKit');
    const [kit, setKit] = useState<Kit>(INITIAL_KIT);
    const [yaml, setYaml] = useState('');
    const [activeTab, setActiveTab] = useState('settings');

    // Item Editor State
    const [isItemEditorOpen, setIsItemEditorOpen] = useState(false);
    const [editingItemIndex, setEditingItemIndex] = useState(-1);
    const [editingItem, setEditingItem] = useState<KitItem | null>(null);

    // Update YAML when kit changes
    useEffect(() => {
        const config: PlayerKitsConfig = {
            kits: {
                [activeKitId]: kit
            }
        };
        const generatedYaml = PlayerKitsYamlGenerator.generate(config);
        setYaml(generatedYaml);
        
        // Sync with store for external DownloadButton
        kitYamlStore.set(generatedYaml);
        kitNameStore.set(activeKitId);
    }, [kit, activeKitId]);

    const handleKitUpdate = (updates: Partial<Kit>) => {
        setKit(prev => ({ ...prev, ...updates }));
    };

    const handleEditItem = (index: number) => {
        setEditingItemIndex(index);
        let item: KitItem;
        if (index === -1) {
            item = {
                material: 'STONE',
                amount: 1
            };
        } else {
            item = kit.items[index];
        }

        // Convert enchantments from string[] to Record<string, number> for ItemEditor
        const enchantRecord: Record<string, number> = {};
        if (item.enchantments) {
            item.enchantments.forEach(enchant => {
                const [id, level] = enchant.split(':');
                enchantRecord[id] = parseInt(level) || 1;
            });
        }

        setEditingItem({
            ...item,
            enchantments: enchantRecord as any // Cast to satisfy ItemData interface temporarily
        });
        setIsItemEditorOpen(true);
    };

    const handleSaveItem = () => {
        if (!editingItem) return;

        // Convert enchantments back to string[] for KitItem
        const enchantList: string[] = [];
        const enchantRecord = (editingItem.enchantments || {}) as unknown as Record<string, number>;
        Object.entries(enchantRecord).forEach(([id, level]) => {
            enchantList.push(`${id}:${level}`);
        });

        const kitItem: KitItem = {
            ...editingItem,
            enchantments: enchantList
        } as KitItem;

        const newItems = [...kit.items];
        if (editingItemIndex === -1) {
            newItems.push(kitItem);
        } else {
            newItems[editingItemIndex] = kitItem;
        }

        handleKitUpdate({ items: newItems });
        setIsItemEditorOpen(false);
        setEditingItem(null);
    };

    return (
        <div className="gap-6 grid grid-cols-1 lg:grid-cols-2 h-full">
            <div className="flex flex-col space-y-4 h-full">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col flex-1 w-full">
                    <TabsList className="grid grid-cols-5 mb-4 w-full">
                        <TabsTrigger value="settings">Settings</TabsTrigger>
                        <TabsTrigger value="items">Items ({kit.items.length})</TabsTrigger>
                        <TabsTrigger value="requirements">Reqs</TabsTrigger>
                        <TabsTrigger value="actions">Actions</TabsTrigger>
                        <TabsTrigger value="display">Display</TabsTrigger>
                    </TabsList>

                    <ScrollArea className="flex-1 p-4 border rounded-md h-[600px] lg:h-auto">
                        <TabsContent value="settings" className="space-y-4 mt-0">
                            <div className="space-y-2 mb-4">
                                <label className="font-medium text-muted-foreground text-xs uppercase">Internal Kit ID (File Name)</label>
                                <input 
                                    className="bg-background px-3 py-2 border rounded-md w-full text-sm"
                                    value={activeKitId}
                                    onChange={(e) => setActiveKitId(e.target.value)}
                                    placeholder="StarterKit"
                                />
                            </div>
                            <BasicSettings kit={kit} onChange={handleKitUpdate} />
                        </TabsContent>

                        <TabsContent value="items" className="mt-0">
                            <ItemsList
                                items={kit.items}
                                onUpdate={(items) => handleKitUpdate({ items })}
                                onEdit={handleEditItem}
                            />
                        </TabsContent>

                        <TabsContent value="requirements" className="mt-0">
                            <RequirementsEditor 
                                requirements={kit.requirements}
                                onChange={(req) => handleKitUpdate({ requirements: req })}
                            />
                        </TabsContent>

                        <TabsContent value="actions" className="mt-0">
                            <ActionsEditor 
                                claimActions={kit.claim_actions || []}
                                errorActions={kit.error_actions || []}
                                onChange={(type, actions) => {
                                    if (type === 'claim') handleKitUpdate({ claim_actions: actions });
                                    else handleKitUpdate({ error_actions: actions });
                                }}
                            />
                        </TabsContent>

                        <TabsContent value="display" className="mt-0">
                            <DisplayItemsEditor 
                                displayData={kit.display}
                                onChange={(display) => handleKitUpdate({ display })}
                            />
                        </TabsContent>
                    </ScrollArea>
                </Tabs>
            </div>

            <div className="h-full">
                <Card className="flex flex-col shadow-sm border-muted-foreground/20 h-full overflow-hidden">
                     <YAMLPreview yaml={yaml} />
                </Card>
            </div>
            
            <Dialog open={isItemEditorOpen} onOpenChange={setIsItemEditorOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{editingItemIndex === -1 ? 'Add New Item' : 'Edit Item'}</DialogTitle>
                    </DialogHeader>
                    
                    {editingItem && (
                        <div className="py-2">
                            <ItemEditor
                                value={editingItem as any}
                                onChange={(val) => setEditingItem(val as any)}
                            />
                        </div>
                    )}

                    <DialogFooter className="pt-4 border-t">
                        <Button variant="outline" onClick={() => setIsItemEditorOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleSaveItem}>
                            Save Item
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}