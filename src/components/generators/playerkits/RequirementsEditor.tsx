import React from 'react';
import type { Requirements } from '@/lib/generators/playerkits/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';

interface RequirementsEditorProps {
  requirements?: Requirements;
  onChange: (requirements: Requirements) => void;
}

export const RequirementsEditor: React.FC<RequirementsEditorProps> = ({ 
  requirements = {}, 
  onChange 
}) => {
  const updateField = (field: keyof Requirements, value: any) => {
    onChange({ ...requirements, [field]: value });
  };

  const addListEntry = (field: 'extra_requirements' | 'message') => {
    const current = requirements[field] || [];
    updateField(field, [...current, '']);
  };

  const updateListEntry = (field: 'extra_requirements' | 'message', index: number, value: string) => {
    const current = [...(requirements[field] || [])];
    current[index] = value;
    updateField(field, current);
  };

  const removeListEntry = (field: 'extra_requirements' | 'message', index: number) => {
    const current = (requirements[field] || []).filter((_, i) => i !== index);
    updateField(field, current);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Basic Requirements</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="gap-2 grid">
            <Label htmlFor="price">Price (Money)</Label>
            <Input 
              type="number" 
              id="price" 
              value={requirements.price || 0}
              onChange={(e) => updateField('price', parseInt(e.target.value) || 0)}
              min={0}
            />
            <p className="text-muted-foreground text-xs">Economy cost to claim the kit.</p>
          </div>

          <div className="flex items-center space-x-2 pt-2">
            <Switch 
              id="one_time_requirements" 
              checked={requirements.one_time || false}
              onCheckedChange={(c) => updateField('one_time', c)}
            />
            <Label htmlFor="one_time_requirements">One Time Requirements</Label>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Extra Requirements</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            {(requirements.extra_requirements || []).map((req, idx) => (
              <div key={idx} className="flex gap-2">
                <Input 
                  value={req} 
                  onChange={(e) => updateListEntry('extra_requirements', idx, e.target.value)}
                  placeholder="%player_level%:10:> for level 10+"
                />
                <Button variant="ghost" size="icon" onClick={() => removeListEntry('extra_requirements', idx)} className="text-muted-foreground hover:text-destructive">
                   <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
            <Button variant="outline" size="sm" onClick={() => addListEntry('extra_requirements')} className="w-full">
              <Plus className="mr-2 w-4 h-4" /> Add Requirement
            </Button>
          </div>
          <p className="text-muted-foreground text-xs">Custom conditions using PlaceholderAPI.</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Requirement Messages</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            {(requirements.message || []).map((msg, idx) => (
              <div key={idx} className="flex gap-2">
                <Input 
                  value={msg} 
                  onChange={(e) => updateListEntry('message', idx, e.target.value)}
                  placeholder="&cYou don't have enough money!"
                />
                <Button variant="ghost" size="icon" onClick={() => removeListEntry('message', idx)} className="text-muted-foreground hover:text-destructive">
                   <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
            <Button variant="outline" size="sm" onClick={() => addListEntry('message')} className="w-full">
              <Plus className="mr-2 w-4 h-4" /> Add Message Line
            </Button>
          </div>
          <p className="text-muted-foreground text-xs">Messages shown when player fails to meet requirements.</p>
        </CardContent>
      </Card>
    </div>
  );
};
