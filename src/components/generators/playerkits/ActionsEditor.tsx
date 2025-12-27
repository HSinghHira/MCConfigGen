import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, X, Settings2 } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import type { ActionDetails } from '@/lib/generators/playerkits/types';

interface ActionsEditorProps {
  claimActions: ActionDetails[];
  errorActions: ActionDetails[];
  onChange: (type: 'claim' | 'error', actions: ActionDetails[]) => void;
}

export const ActionsEditor: React.FC<ActionsEditorProps> = ({ 
  claimActions = [], 
  errorActions = [], 
  onChange 
}) => {
  const [activeTab, setActiveTab] = useState('claim');
  const [newAction, setNewAction] = useState('');
  const [actionType, setActionType] = useState('message');
  
  // Advanced flags for new action
  const [executeBefore, setExecuteBefore] = useState(false);
  const [countAsItem, setCountAsItem] = useState(false);

  const currentActions = activeTab === 'claim' ? claimActions : errorActions;

  const handleAdd = () => {
    if (!newAction) return;
    
    let formattedAction = newAction;
    // Prefix if not already prefixed (simple heuristic)
    if (!formattedAction.includes(': ') && !formattedAction.startsWith('[')) {
        formattedAction = `[${actionType}] ${newAction}`;
    }

    const actionObj: ActionDetails = {
        action: formattedAction,
        execute_before_items: executeBefore,
        count_as_item: countAsItem
    };

    const updated = [...currentActions, actionObj];
    onChange(activeTab as 'claim' | 'error', updated);
    
    // Reset
    setNewAction('');
    setExecuteBefore(false);
    setCountAsItem(false);
  };

  const handleRemove = (index: number) => {
    const updated = currentActions.filter((_, i) => i !== index);
    onChange(activeTab as 'claim' | 'error', updated);
  };

  const toggleActionFlag = (index: number, flag: 'execute_before_items' | 'count_as_item') => {
    const updated = [...currentActions];
    updated[index] = {
        ...updated[index],
        [flag]: !updated[index][flag]
    };
    onChange(activeTab as 'claim' | 'error', updated);
  };

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 w-full">
          <TabsTrigger value="claim">Claim Actions</TabsTrigger>
          <TabsTrigger value="error">Error Actions</TabsTrigger>
        </TabsList>

        {['claim', 'error'].map((tab) => (
           <TabsContent key={tab} value={tab} className="space-y-4 mt-4">
              <div className="flex flex-col gap-3 bg-muted/20 p-4 border rounded-lg">
                  <div className="flex gap-2">
                     <Select value={actionType} onValueChange={setActionType}>
                        <SelectTrigger className="w-[180px]">
                           <SelectValue placeholder="Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="message">Message</SelectItem>
                          <SelectItem value="console">Console Command</SelectItem>
                          <SelectItem value="player">Player Command</SelectItem>
                          <SelectItem value="sound">Play Sound</SelectItem>
                          <SelectItem value="title">Title</SelectItem>
                          <SelectItem value="actionbar">Action Bar</SelectItem>
                          <SelectItem value="firework">Firework</SelectItem>
                        </SelectContent>
                     </Select>
                     <Input 
                        value={newAction}
                        onChange={(e) => setNewAction(e.target.value)}
                        placeholder={getPlaceholder(actionType)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                        className="flex-1"
                     />
                     <Button onClick={handleAdd}><Plus className="mr-2 w-4 h-4" /> Add</Button>
                  </div>
                  
                  <div className="flex items-center gap-6 px-1">
                      <div className="flex items-center space-x-2">
                        <Switch 
                            id="new-execute-before" 
                            checked={executeBefore} 
                            onCheckedChange={setExecuteBefore}
                        />
                        <Label htmlFor="new-execute-before" className="text-xs cursor-pointer">Execute Before Items</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch 
                            id="new-count-item" 
                            checked={countAsItem} 
                            onCheckedChange={setCountAsItem}
                        />
                        <Label htmlFor="new-count-item" className="text-xs cursor-pointer">Count as Item</Label>
                      </div>
                  </div>
              </div>

              <div className="space-y-2">
                {currentActions.length === 0 ? (
                    <div className="bg-muted/30 py-8 border border-dashed rounded-md text-muted-foreground text-sm text-center">
                       No actions defined for {tab}.
                    </div>
                ) : (
                    currentActions.map((actionObj, idx) => (
                       <div key={idx} className="flex flex-col bg-card shadow-sm p-3 border rounded-md">
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-mono text-sm break-all">{actionObj.action}</span>
                            <Button variant="ghost" size="icon" className="w-8 h-8 text-muted-foreground hover:text-destructive" onClick={() => handleRemove(idx)}>
                                <X className="w-4 h-4" />
                            </Button>
                          </div>
                          
                          <div className="flex items-center gap-4 mt-1 pt-2 border-t text-[10px] text-muted-foreground uppercase tracking-wider">
                             <div className="flex items-center gap-1.5">
                                <Switch 
                                    className="scale-75"
                                    checked={actionObj.execute_before_items || false}
                                    onCheckedChange={() => toggleActionFlag(idx, 'execute_before_items')}
                                />
                                <span>Before Items</span>
                             </div>
                             <div className="flex items-center gap-1.5">
                                <Switch 
                                    className="scale-75"
                                    checked={actionObj.count_as_item || false}
                                    onCheckedChange={() => toggleActionFlag(idx, 'count_as_item')}
                                />
                                <span>Count Item</span>
                             </div>
                          </div>
                       </div>
                    ))
                )}
              </div>
           </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

function getPlaceholder(type: string): string {
    switch(type) {
        case 'message': return '&aYou claimed the kit!';
        case 'console': return 'give %player% diamond 1';
        case 'player': return 'spawn';
        case 'sound': return 'BLOCK_NOTE_BLOCK_PLING;10;0.1';
        case 'title': return '&6Kit Claimed!;&eEnjoy your items';
        case 'actionbar': return '&aKit claimed successfully';
        case 'firework': return 'colors:BLACK,WHITE type:BURST power:1';
        default: return 'Action value...';
    }
}
