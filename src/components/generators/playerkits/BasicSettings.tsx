import React from "react";
import type { Kit } from "@/lib/generators/playerkits/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface BasicSettingsProps {
  kit: Kit;
  onChange: (updates: Partial<Kit>) => void;
}

export const BasicSettings: React.FC<BasicSettingsProps> = ({
  kit,
  onChange,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    let newValue: any = value;

    if (type === "number") {
      newValue = parseFloat(value) || 0;
    }

    onChange({ [name]: newValue });
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    onChange({ [name]: checked });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>General Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="gap-2 grid">
            <Label htmlFor="display_name">Display Name</Label>
            <Input
              type="text"
              id="display_name"
              name="display_name"
              value={kit.display_name || ""}
              onChange={handleChange}
              placeholder="&eStarter Kit"
            />
            <p className="text-muted-foreground text-xs">
              Shown in kit GUI/menus. Supports color codes.
            </p>
          </div>

          <div className="gap-4 grid grid-cols-1 md:grid-cols-2">
            <div className="gap-2 grid">
              <Label htmlFor="cooldown">Cooldown (seconds)</Label>
              <Input
                type="number"
                id="cooldown"
                name="cooldown"
                value={kit.cooldown || 0}
                onChange={handleChange}
                min={0}
              />
            </div>

            <div className="gap-2 grid">
              <Label htmlFor="slot">GUI Slot</Label>
              <Input
                type="number"
                id="slot"
                name="slot"
                value={kit.slot || 0}
                onChange={handleChange}
                min={0}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Requirements & Permissions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="gap-2 grid">
            <Label htmlFor="custom_permission">
              Custom Permission Requirement
            </Label>
            <Input
              type="text"
              id="custom_permission"
              name="custom_permission"
              value={kit.custom_permission || ""}
              onChange={handleChange}
              placeholder="my.custom.permission"
            />
            <p className="text-muted-foreground text-xs">
              Additional permission required to claim.
            </p>
          </div>

          <div className="flex items-center space-x-2 pt-2">
            <Switch
              id="permission_required"
              checked={kit.permission_required || false}
              onCheckedChange={(c) =>
                handleSwitchChange("permission_required", c)
              }
            />
            <Label htmlFor="permission_required">Permission Required</Label>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Behavior Flags</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="gap-6 grid grid-cols-1 md:grid-cols-2">
            <div className="flex justify-between items-center space-x-2">
              <Label htmlFor="auto_armor" className="grow">
                Auto-Equip Armor
              </Label>
              <Switch
                id="auto_armor"
                checked={kit.auto_armor !== false}
                onCheckedChange={(c) => handleSwitchChange("auto_armor", c)}
              />
            </div>

            <div className="flex justify-between items-center space-x-2">
              <Label htmlFor="auto_offhand" className="grow">
                Auto-Equip Offhand
              </Label>
              <Switch
                id="auto_offhand"
                checked={kit.auto_offhand || false}
                onCheckedChange={(c) => handleSwitchChange("auto_offhand", c)}
              />
            </div>

            <div className="flex justify-between items-center space-x-2">
              <Label htmlFor="one_time" className="grow">
                One Time Use
              </Label>
              <Switch
                id="one_time"
                checked={kit.one_time || false}
                onCheckedChange={(c) => handleSwitchChange("one_time", c)}
              />
            </div>

            <div className="flex justify-between items-center space-x-2">
              <Label htmlFor="clear_inventory" className="grow">
                Clear Inventory
              </Label>
              <Switch
                id="clear_inventory"
                checked={kit.clear_inventory || false}
                onCheckedChange={(c) =>
                  handleSwitchChange("clear_inventory", c)
                }
              />
            </div>

            <div className="flex justify-between items-center space-x-2">
              <Label htmlFor="save_original_items" className="grow">
                Save Original Items
              </Label>
              <Switch
                id="save_original_items"
                checked={kit.save_original_items || false}
                onCheckedChange={(c) =>
                  handleSwitchChange("save_original_items", c)
                }
              />
            </div>

            <div className="flex justify-between items-center space-x-2">
              <Label
                htmlFor="allow_placeholders_on_original_items"
                className="grow"
              >
                Allow Placeholders (Orig. Items)
              </Label>
              <Switch
                id="allow_placeholders_on_original_items"
                checked={kit.allow_placeholders_on_original_items || false}
                onCheckedChange={(c) =>
                  handleSwitchChange("allow_placeholders_on_original_items", c)
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
