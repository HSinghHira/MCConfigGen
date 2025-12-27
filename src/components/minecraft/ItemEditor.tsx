import React, { useState } from "react";
import { MaterialSelector } from "./MaterialSelector";
import { EnchantmentSelector } from "./EnchantmentSelector";
import { TextFormatter } from "./TextFormatter";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Trash2, Plus, ChevronDown, ChevronUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import type {
  KitItem,
  PotionData,
  BannerData,
  FireworkData,
  BookData,
  CustomModelComponentData,
  ItemFlag,
  SkullData,
  ArmorTrim,
} from "@/lib/generators/playerkits/types";

// The UI component uses a slightly different structure for its local state (Record for enchants)
export interface ItemData extends Omit<KitItem, "enchantments" | "item_flags"> {
  enchantments?: Record<string, number>;
  item_flags?: string[];
}

interface ItemEditorProps {
  value: ItemData;
  onChange: (value: ItemData) => void;
  className?: string;
}

const DEFAULT_ITEM: ItemData = {
  material: "STONE",
  amount: 1,
  enchantments: {},
  lore: [],
};

const ITEM_FLAGS = [
  "HIDE_ENCHANTS",
  "HIDE_ATTRIBUTES",
  "HIDE_UNBREAKABLE",
  "HIDE_DESTROYS",
  "HIDE_PLACED_ON",
  "HIDE_POTION_EFFECTS",
  "HIDE_DYE",
  "HIDE_ARMOR_TRIM",
  "HIDE_ADDITIONAL_TOOLTIP",
];

const POTION_TYPES = [
  "WATER",
  "MUNDANE",
  "THICK",
  "AWKWARD",
  "NIGHT_VISION",
  "INVISIBILITY",
  "LEAPING",
  "FIRE_RESISTANCE",
  "SWIFTNESS",
  "SLOWNESS",
  "WATER_BREATHING",
  "HEALING",
  "HARMING",
  "POISON",
  "REGENERATION",
  "STRENGTH",
  "WEAKNESS",
  "LUCK",
  "TURTLE_MASTER",
  "SLOW_FALLING",
  "UNCRAFTABLE",
];

const POTION_EFFECTS = [
  "SPEED",
  "SLOW",
  "FAST_DIGGING",
  "SLOW_DIGGING",
  "INCREASE_DAMAGE",
  "HEAL",
  "HARM",
  "JUMP",
  "CONFUSION",
  "REGENERATION",
  "DAMAGE_RESISTANCE",
  "FIRE_RESISTANCE",
  "WATER_BREATHING",
  "INVISIBILITY",
  "BLINDNESS",
  "NIGHT_VISION",
  "HUNGER",
  "WEAKNESS",
  "POISON",
  "WITHER",
  "HEALTH_BOOST",
  "ABSORPTION",
  "SATURATION",
  "GLOWING",
  "LEVITATION",
  "LUCK",
  "UNLUCK",
  "SLOW_FALLING",
  "CONDUIT_POWER",
  "DOLPHINS_GRACE",
  "BAD_OMEN",
  "HERO_OF_THE_VILLAGE",
];

const BANNER_PATTERNS = [
  "BASE",
  "SQUARE_BOTTOM_LEFT",
  "SQUARE_BOTTOM_RIGHT",
  "SQUARE_TOP_LEFT",
  "SQUARE_TOP_RIGHT",
  "STRIPE_BOTTOM",
  "STRIPE_TOP",
  "STRIPE_LEFT",
  "STRIPE_RIGHT",
  "STRIPE_CENTER",
  "STRIPE_MIDDLE",
  "STRIPE_DOWNRIGHT",
  "STRIPE_DOWNLEFT",
  "STRIPE_SMALL",
  "CROSS",
  "STRAIGHT_CROSS",
  "TRIANGLE_BOTTOM",
  "TRIANGLE_TOP",
  "TRIANGLES_BOTTOM",
  "TRIANGLES_TOP",
  "DIAGONAL_LEFT",
  "DIAGONAL_RIGHT",
  "DIAGONAL_LEFT_MIRROR",
  "DIAGONAL_RIGHT_MIRROR",
  "CIRCLE_MIDDLE",
  "RHOMBUS_MIDDLE",
  "HALF_VERTICAL",
  "HALF_HORIZONTAL",
  "HALF_VERTICAL_MIRROR",
  "HALF_HORIZONTAL_MIRROR",
  "BORDER",
  "CURLY_BORDER",
  "CREEPER",
  "GRADIENT",
  "GRADIENT_UP",
  "BRICKS",
  "SKULL",
  "FLOWER",
  "MOJANG",
  "GLOBE",
  "PIGLIN",
];

const DYE_COLORS = [
  "WHITE",
  "ORANGE",
  "MAGENTA",
  "LIGHT_BLUE",
  "YELLOW",
  "LIME",
  "PINK",
  "GRAY",
  "LIGHT_GRAY",
  "CYAN",
  "PURPLE",
  "BLUE",
  "BROWN",
  "GREEN",
  "RED",
  "BLACK",
];

const BOOK_GENERATIONS = [
  "ORIGINAL",
  "COPY_OF_ORIGINAL",
  "COPY_OF_COPY",
  "TATTERED",
];

// Map material types to enchantment categories
function getMaterialCategory(
  material: string
):
  | "weapon"
  | "head_armor"
  | "torso_armor"
  | "leg_armor"
  | "foot_armor"
  | "bow"
  | "crossbow"
  | "digger"
  | "fishing_rod"
  | "trident"
  | undefined {
  const mat = material.toLowerCase();

  // Weapons
  if (mat.includes("sword")) return "weapon";
  if (mat.includes("axe") && !mat.includes("pickaxe")) return "weapon"; // Axe can be weapon or tool
  if (mat.includes("pickaxe") || mat.includes("shovel") || mat.includes("hoe"))
    return "digger";

  // Armor
  if (mat.includes("helmet")) return "head_armor";
  if (mat.includes("chestplate")) return "torso_armor";
  if (mat.includes("leggings")) return "leg_armor";
  if (mat.includes("boots")) return "foot_armor";

  // Other tools
  if (mat.includes("bow") && !mat.includes("cross")) return "bow";
  if (mat.includes("crossbow")) return "crossbow";
  if (mat.includes("fishing_rod")) return "fishing_rod";
  if (mat.includes("trident")) return "trident";

  return undefined;
}

export const ItemEditor: React.FC<ItemEditorProps> = ({
  value = DEFAULT_ITEM,
  onChange,
  className = "",
}) => {
  const [activeTab, setActiveTab] = useState("general");

  const updateField = (field: keyof ItemData, val: any) => {
    onChange({ ...value, [field]: val });
  };

  const updateSkullData = (field: keyof SkullData, val: string) => {
    const currentSkull = value.skull_data || {};
    updateField("skull_data", { ...currentSkull, [field]: val });
  };

  const updateTrimData = (field: keyof ArmorTrim, val: string) => {
    const currentTrim = value.armor_trim || {
      pattern: "ward",
      material: "redstone",
    };
    updateField("armor_trim", { ...currentTrim, [field]: val });
  };

  const toggleFlag = (flag: string) => {
    const currentFlags = value.item_flags || [];
    if (currentFlags.includes(flag)) {
      updateField(
        "item_flags",
        currentFlags.filter((f) => f !== flag)
      );
    } else {
      updateField("item_flags", [...currentFlags, flag]);
    }
  };

  const addLoreLine = () => {
    const newLore = [...(value.lore || []), ""];
    updateField("lore", newLore);
  };

  const updateLoreLine = (index: number, text: string) => {
    const newLore = [...(value.lore || [])];
    newLore[index] = text;
    updateField("lore", newLore);
  };

  const removeLoreLine = (index: number) => {
    const newLore = (value.lore || []).filter((_, i) => i !== index);
    updateField("lore", newLore);
  };

  const materialCategory = getMaterialCategory(value.material);

  return (
    <div className={`space-y-4 ${className}`}>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="lore">Lore</TabsTrigger>
          <TabsTrigger value="enchants">Enchants</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4 py-4">
          <MaterialSelector
            value={value.material}
            onChange={(m) => updateField("material", m)}
            label="Material"
          />

          <div className="gap-4 grid grid-cols-1 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="item-amount">Amount</Label>
              <Input
                id="item-amount"
                type="number"
                min="1"
                max="64"
                value={value.amount}
                onChange={(e) =>
                  updateField("amount", parseInt(e.target.value) || 1)
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="item-durability">Durability / Damage</Label>
              <Input
                id="item-durability"
                type="number"
                min="0"
                placeholder="0"
                value={value.durability || ""}
                onChange={(e) =>
                  updateField(
                    "durability",
                    e.target.value ? parseInt(e.target.value) : undefined
                  )
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="item-model">Custom Model Data</Label>
              <Input
                id="item-model"
                type="number"
                placeholder="100"
                value={value.custom_model_data || ""}
                onChange={(e) =>
                  updateField(
                    "custom_model_data",
                    e.target.value ? parseInt(e.target.value) : undefined
                  )
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="preview-slot">Preview Slot (GUI)</Label>
              <Input
                id="preview-slot"
                type="number"
                placeholder="0"
                value={value.preview_slot || ""}
                onChange={(e) =>
                  updateField(
                    "preview_slot",
                    e.target.value ? parseInt(e.target.value) : undefined
                  )
                }
              />
            </div>
          </div>

          <div className="gap-4 grid grid-cols-2">
            <div className="flex items-center space-x-2 pt-4">
              <Switch
                id="item-unbreakable"
                checked={value.unbreakable || false}
                onCheckedChange={(checked) =>
                  updateField("unbreakable", checked)
                }
              />
              <Label htmlFor="item-unbreakable">Unbreakable</Label>
            </div>
            <div className="flex items-center space-x-2 pt-4">
              <Switch
                id="item-offhand"
                checked={value.offhand || false}
                onCheckedChange={(checked) => updateField("offhand", checked)}
              />
              <Label htmlFor="item-offhand">Offhand</Label>
            </div>
          </div>

          <TextFormatter
            value={value.name || ""}
            onChange={(n) => updateField("name", n)}
            label="Display Name"
          />
        </TabsContent>

        <TabsContent value="lore" className="space-y-4 py-4">
          <div className="space-y-2">
            {(value.lore || []).map((line, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <div className="flex-1">
                  <TextFormatter
                    value={line}
                    onChange={(txt) => updateLoreLine(idx, txt)}
                    className="w-full"
                    label={`Line ${idx + 1}`}
                  />
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeLoreLine(idx)}
                  className="hover:bg-destructive/10 mt-8 text-destructive hover:text-destructive/90"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
          <Button
            onClick={addLoreLine}
            variant="outline"
            className="gap-2 w-full"
          >
            <Plus className="w-4 h-4" /> Add Lore Line
          </Button>
        </TabsContent>

        <TabsContent value="enchants" className="space-y-4 py-4">
          <EnchantmentSelector
            value={value.enchantments || {}}
            onChange={(e) => updateField("enchantments", e)}
            category={materialCategory}
          />
          {!materialCategory && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 border border-yellow-200 dark:border-yellow-900 rounded-md text-yellow-600 dark:text-yellow-400 text-sm">
              This item may not support specific enchantments, generally only
              universal ones.
            </div>
          )}
        </TabsContent>

        <TabsContent value="advanced" className="space-y-6 py-4">
          {/* Item Flags */}
          <Card className="border-muted">
            <CardContent className="space-y-4 pt-6">
              <Label className="font-semibold">Item Flags</Label>
              <div className="gap-4 grid grid-cols-1 md:grid-cols-2">
                {ITEM_FLAGS.map((flag) => (
                  <div
                    key={flag}
                    className="flex justify-between items-center space-x-2 bg-muted/20 p-2 border rounded-md"
                  >
                    <Label
                      htmlFor={flag}
                      className="font-medium text-xs cursor-pointer"
                    >
                      {flag.replace("HIDE_", "")}
                    </Label>
                    <Switch
                      id={flag}
                      checked={(value.item_flags || []).includes(flag)}
                      onCheckedChange={() => toggleFlag(flag)}
                      className="scale-75"
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Skull Data */}
          <Card className="border-muted">
            <CardContent className="space-y-4 pt-6">
              <Label className="font-semibold">Skull Data (Player Head)</Label>
              <div className="space-y-2">
                <Label
                  htmlFor="skull-owner"
                  className="text-muted-foreground text-xs"
                >
                  Owner (Name or %player%)
                </Label>
                <Input
                  id="skull-owner"
                  value={value.skull_data?.owner || ""}
                  onChange={(e) => updateSkullData("owner", e.target.value)}
                  placeholder="%player%"
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="skull-texture"
                  className="text-muted-foreground text-xs"
                >
                  Texture (Base64)
                </Label>
                <Textarea
                  id="skull-texture"
                  value={value.skull_data?.texture || ""}
                  onChange={(e) => updateSkullData("texture", e.target.value)}
                  placeholder="eyJ0ZXh0dXJlcy..."
                  className="font-mono text-xs"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Armor Trim */}
          <Card className="border-muted">
            <CardContent className="space-y-4 pt-6">
              <Label className="font-semibold">Armor Trim (1.20+)</Label>
              <div className="gap-4 grid grid-cols-2">
                <div className="space-y-2">
                  <Label
                    htmlFor="trim-pattern"
                    className="text-muted-foreground text-xs"
                  >
                    Pattern
                  </Label>
                  <Input
                    id="trim-pattern"
                    value={value.armor_trim?.pattern || ""}
                    onChange={(e) => updateTrimData("pattern", e.target.value)}
                    placeholder="ward"
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="trim-material"
                    className="text-muted-foreground text-xs"
                  >
                    Material
                  </Label>
                  <Input
                    id="trim-material"
                    value={value.armor_trim?.material || ""}
                    onChange={(e) => updateTrimData("material", e.target.value)}
                    placeholder="redstone"
                  />
                  e
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Version Specific Fields (1.20.6+) */}
          <Card className="border-muted">
            <CardContent className="space-y-4 pt-6">
              <Label className="font-semibold">
                Version Specific (1.20.6+)
              </Label>
              <div className="flex items-center space-x-2 pt-2">
                <Switch
                  id="hide-tooltip"
                  checked={value.hide_tooltip || false}
                  onCheckedChange={(checked) =>
                    updateField("hide_tooltip", checked)
                  }
                />
                <Label htmlFor="hide-tooltip">Hide Tooltip</Label>
              </div>
              <div className="gap-4 grid grid-cols-2">
                <div className="space-y-2">
                  <Label
                    htmlFor="tooltip-style"
                    className="text-muted-foreground text-xs"
                  >
                    Tooltip Style
                  </Label>
                  <Input
                    id="tooltip-style"
                    value={value.tooltip_style || ""}
                    onChange={(e) =>
                      updateField("tooltip_style", e.target.value)
                    }
                    placeholder="minecraft:fancy"
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="item-model"
                    className="text-muted-foreground text-xs"
                  >
                    Model (1.21.4+)
                  </Label>
                  <Input
                    id="item-model-path"
                    value={value.model || ""}
                    onChange={(e) => updateField("model", e.target.value)}
                    placeholder="minecraft:special_sword"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Potion Data Editor */}
          <Card className="border-muted">
            <CardContent className="space-y-4 pt-6">
              <Label className="flex justify-between items-center font-semibold">
                Potion Data
                <span className="opacity-50 font-normal text-[10px] uppercase">
                  Structured
                </span>
              </Label>

              <div className="gap-4 grid grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-muted-foreground text-xs">
                    Base Type
                  </Label>
                  <Select
                    value={value.potion_data?.type || "UNCRAFTABLE"}
                    onValueChange={(val) =>
                      updateField("potion_data", {
                        ...value.potion_data,
                        type: val,
                      })
                    }
                  >
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      {POTION_TYPES.map((t) => (
                        <SelectItem key={t} value={t} className="text-xs">
                          {t}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground text-xs">
                    Color (Decimal)
                  </Label>
                  <Input
                    type="number"
                    value={value.potion_data?.color || ""}
                    onChange={(e) =>
                      updateField("potion_data", {
                        ...value.potion_data,
                        color: parseInt(e.target.value) || undefined,
                      })
                    }
                    placeholder="6196631"
                    className="h-8 text-xs"
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="pot-extended"
                    checked={value.potion_data?.extended || false}
                    onCheckedChange={(val) =>
                      updateField("potion_data", {
                        ...value.potion_data,
                        extended: val,
                      })
                    }
                    className="scale-75"
                  />
                  <Label htmlFor="pot-extended" className="text-xs">
                    Extended
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="pot-upgraded"
                    checked={value.potion_data?.upgraded || false}
                    onCheckedChange={(val) =>
                      updateField("potion_data", {
                        ...value.potion_data,
                        upgraded: val,
                      })
                    }
                    className="scale-75"
                  />
                  <Label htmlFor="pot-upgraded" className="text-xs">
                    Upgraded
                  </Label>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <Label className="font-semibold text-xs">Custom Effects</Label>
                <div className="space-y-2 pr-2 max-h-[150px] overflow-y-auto">
                  {(value.potion_data?.effects || []).map((eff, idx) => {
                    const [name, level, duration] = eff.split(";");
                    return (
                      <div
                        key={idx}
                        className="flex items-center gap-2 bg-muted/30 p-2 border rounded-md"
                      >
                        <Select
                          value={name}
                          onValueChange={(val) => {
                            const newEffects = [
                              ...(value.potion_data?.effects || []),
                            ];
                            newEffects[idx] = `${val};${level};${duration}`;
                            updateField("potion_data", {
                              ...value.potion_data,
                              effects: newEffects,
                            });
                          }}
                        >
                          <SelectTrigger className="flex-1 h-7 text-[10px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {POTION_EFFECTS.map((pe) => (
                              <SelectItem
                                key={pe}
                                value={pe}
                                className="text-[10px]"
                              >
                                {pe}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Input
                          type="number"
                          placeholder="Lvl"
                          value={level}
                          className="p-1 w-12 h-7 text-[10px]"
                          onChange={(e) => {
                            const newEffects = [
                              ...(value.potion_data?.effects || []),
                            ];
                            newEffects[
                              idx
                            ] = `${name};${e.target.value};${duration}`;
                            updateField("potion_data", {
                              ...value.potion_data,
                              effects: newEffects,
                            });
                          }}
                        />
                        <Input
                          type="number"
                          placeholder="Dur"
                          value={duration}
                          className="p-1 w-16 h-7 text-[10px]"
                          onChange={(e) => {
                            const newEffects = [
                              ...(value.potion_data?.effects || []),
                            ];
                            newEffects[
                              idx
                            ] = `${name};${level};${e.target.value}`;
                            updateField("potion_data", {
                              ...value.potion_data,
                              effects: newEffects,
                            });
                          }}
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="w-6 h-6 text-destructive"
                          onClick={() => {
                            const newEffects = (
                              value.potion_data?.effects || []
                            ).filter((_, i) => i !== idx);
                            updateField("potion_data", {
                              ...value.potion_data,
                              effects: newEffects,
                            });
                          }}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    );
                  })}
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1 w-full h-7 text-[10px]"
                    onClick={() => {
                      const newEffects = [
                        ...(value.potion_data?.effects || []),
                        "SPEED;0;1200",
                      ];
                      updateField("potion_data", {
                        ...value.potion_data,
                        effects: newEffects,
                      });
                    }}
                  >
                    <Plus className="w-3 h-3" /> Add Effect
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Banner Data Editor */}
          <Card className="border-muted">
            <CardContent className="space-y-4 pt-6">
              <Label className="flex justify-between items-center font-semibold">
                Banner Patterns
                <span className="opacity-50 font-normal text-[10px] uppercase">
                  Structured
                </span>
              </Label>
              <div className="space-y-2">
                <div className="space-y-2 pr-2 max-h-[150px] overflow-y-auto">
                  {(value.banner_data?.patterns || []).map((pat, idx) => {
                    const [color, type] = pat.split(";");
                    return (
                      <div
                        key={idx}
                        className="flex items-center gap-2 bg-muted/30 p-2 border rounded-md"
                      >
                        <Select
                          value={color}
                          onValueChange={(val) => {
                            const newPatterns = [
                              ...(value.banner_data?.patterns || []),
                            ];
                            newPatterns[idx] = `${val};${type}`;
                            updateField("banner_data", {
                              ...value.banner_data,
                              patterns: newPatterns,
                            });
                          }}
                        >
                          <SelectTrigger className="flex-1 h-7 text-[10px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {DYE_COLORS.map((c) => (
                              <SelectItem
                                key={c}
                                value={c}
                                className="text-[10px]"
                              >
                                {c}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Select
                          value={type}
                          onValueChange={(val) => {
                            const newPatterns = [
                              ...(value.banner_data?.patterns || []),
                            ];
                            newPatterns[idx] = `${color};${val}`;
                            updateField("banner_data", {
                              ...value.banner_data,
                              patterns: newPatterns,
                            });
                          }}
                        >
                          <SelectTrigger className="flex-1 h-7 text-[10px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {BANNER_PATTERNS.map((p) => (
                              <SelectItem
                                key={p}
                                value={p}
                                className="text-[10px]"
                              >
                                {p}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="w-6 h-6 text-destructive"
                          onClick={() => {
                            const newPatterns = (
                              value.banner_data?.patterns || []
                            ).filter((_, i) => i !== idx);
                            updateField("banner_data", {
                              ...value.banner_data,
                              patterns: newPatterns,
                            });
                          }}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    );
                  })}
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1 w-full h-7 text-[10px]"
                    onClick={() => {
                      const newPatterns = [
                        ...(value.banner_data?.patterns || []),
                        "WHITE;BASE",
                      ];
                      updateField("banner_data", {
                        ...value.banner_data,
                        patterns: newPatterns,
                      });
                    }}
                  >
                    <Plus className="w-3 h-3" /> Add Pattern
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Firework Data Editor */}
          <Card className="border-muted">
            <CardContent className="space-y-4 pt-6">
              <Label className="flex justify-between items-center font-semibold">
                Firework Data
                <span className="opacity-50 font-normal text-[10px] uppercase">
                  Structured
                </span>
              </Label>
              <div className="space-y-2">
                <Label className="text-muted-foreground text-xs">
                  Rocket Power
                </Label>
                <Input
                  type="number"
                  value={value.firework_data?.power || ""}
                  onChange={(e) =>
                    updateField("firework_data", {
                      ...value.firework_data,
                      power: parseInt(e.target.value) || undefined,
                    })
                  }
                  placeholder="1"
                  className="h-8 text-xs"
                />
              </div>
              <div className="space-y-2 pt-2">
                <Label className="font-semibold text-xs">Rocket Effects</Label>
                <div className="space-y-2 pr-2 max-h-[150px] overflow-y-auto">
                  {(value.firework_data?.rocket_effects || []).map(
                    (eff, idx) => {
                      const [type, color, fade, flicker, trail] =
                        eff.split(";");
                      return (
                        <div
                          key={idx}
                          className="space-y-2 bg-muted/30 p-2 border rounded-md"
                        >
                          <div className="flex items-center gap-2">
                            <Select
                              value={type}
                              onValueChange={(val) => {
                                const newEffects = [
                                  ...(value.firework_data?.rocket_effects ||
                                    []),
                                ];
                                newEffects[
                                  idx
                                ] = `${val};${color};${fade};${flicker};${trail}`;
                                updateField("firework_data", {
                                  ...value.firework_data,
                                  rocket_effects: newEffects,
                                });
                              }}
                            >
                              <SelectTrigger className="flex-1 h-7 text-[10px]">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {[
                                  "BALL",
                                  "LARGE_BALL",
                                  "STAR",
                                  "BURST",
                                  "CREEPER",
                                ].map((t) => (
                                  <SelectItem
                                    key={t}
                                    value={t}
                                    className="text-[10px]"
                                  >
                                    {t}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="w-6 h-6 text-destructive"
                              onClick={() => {
                                const newEffects = (
                                  value.firework_data?.rocket_effects || []
                                ).filter((_, i) => i !== idx);
                                updateField("firework_data", {
                                  ...value.firework_data,
                                  rocket_effects: newEffects,
                                });
                              }}
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                          <div className="gap-2 grid grid-cols-2">
                            <Input
                              placeholder="Color (e.g. RED)"
                              value={color}
                              className="p-1 h-7 text-[10px]"
                              onChange={(e) => {
                                const newEffects = [
                                  ...(value.firework_data?.rocket_effects ||
                                    []),
                                ];
                                newEffects[
                                  idx
                                ] = `${type};${e.target.value};${fade};${flicker};${trail}`;
                                updateField("firework_data", {
                                  ...value.firework_data,
                                  rocket_effects: newEffects,
                                });
                              }}
                            />
                            <Input
                              placeholder="Fade (e.g. ORANGE)"
                              value={fade}
                              className="p-1 h-7 text-[10px]"
                              onChange={(e) => {
                                const newEffects = [
                                  ...(value.firework_data?.rocket_effects ||
                                    []),
                                ];
                                newEffects[
                                  idx
                                ] = `${type};${color};${e.target.value};${flicker};${trail}`;
                                updateField("firework_data", {
                                  ...value.firework_data,
                                  rocket_effects: newEffects,
                                });
                              }}
                            />
                          </div>
                          <div className="flex gap-4">
                            <div className="flex items-center space-x-1">
                              <Switch
                                checked={flicker === "true"}
                                onCheckedChange={(val) => {
                                  const newEffects = [
                                    ...(value.firework_data?.rocket_effects ||
                                      []),
                                  ];
                                  newEffects[
                                    idx
                                  ] = `${type};${color};${fade};${val};${trail}`;
                                  updateField("firework_data", {
                                    ...value.firework_data,
                                    rocket_effects: newEffects,
                                  });
                                }}
                                className="scale-50"
                              />
                              <Label className="text-[10px]">Flicker</Label>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Switch
                                checked={trail === "true"}
                                onCheckedChange={(val) => {
                                  const newEffects = [
                                    ...(value.firework_data?.rocket_effects ||
                                      []),
                                  ];
                                  newEffects[
                                    idx
                                  ] = `${type};${color};${fade};${flicker};${val}`;
                                  updateField("firework_data", {
                                    ...value.firework_data,
                                    rocket_effects: newEffects,
                                  });
                                }}
                                className="scale-50"
                              />
                              <Label className="text-[10px]">Trail</Label>
                            </div>
                          </div>
                        </div>
                      );
                    }
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1 w-full h-7 text-[10px]"
                    onClick={() => {
                      const newEffects = [
                        ...(value.firework_data?.rocket_effects || []),
                        "BALL;WHITE;WHITE;false;false",
                      ];
                      updateField("firework_data", {
                        ...value.firework_data,
                        rocket_effects: newEffects,
                      });
                    }}
                  >
                    <Plus className="w-3 h-3" /> Add Rocket Effect
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Book Data Editor */}
          <Card className="border-muted">
            <CardContent className="space-y-4 pt-6">
              <Label className="flex justify-between items-center font-semibold">
                Book Settings
                <span className="opacity-50 font-normal text-[10px] uppercase">
                  Structured
                </span>
              </Label>
              <div className="gap-4 grid grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-muted-foreground text-xs">Title</Label>
                  <Input
                    value={value.book_data?.title || ""}
                    onChange={(e) =>
                      updateField("book_data", {
                        ...value.book_data,
                        title: e.target.value,
                      })
                    }
                    placeholder="My Book"
                    className="h-8 text-xs"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground text-xs">
                    Author
                  </Label>
                  <Input
                    value={value.book_data?.author || ""}
                    onChange={(e) =>
                      updateField("book_data", {
                        ...value.book_data,
                        author: e.target.value,
                      })
                    }
                    placeholder="Ajneb97"
                    className="h-8 text-xs"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-muted-foreground text-xs">
                  Generation
                </Label>
                <Select
                  value={value.book_data?.generation || "ORIGINAL"}
                  onValueChange={(val) =>
                    updateField("book_data", {
                      ...value.book_data,
                      generation: val,
                    })
                  }
                >
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {BOOK_GENERATIONS.map((g) => (
                      <SelectItem key={g} value={g} className="text-xs">
                        {g}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 pt-2">
                <Label className="font-semibold text-xs">Pages</Label>
                <div className="space-y-2">
                  {(value.book_data?.pages || []).map((page, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <Textarea
                        value={page}
                        onChange={(e) => {
                          const newPages = [...(value.book_data?.pages || [])];
                          newPages[idx] = e.target.value;
                          updateField("book_data", {
                            ...value.book_data,
                            pages: newPages,
                          });
                        }}
                        placeholder={`Page ${idx + 1} content...`}
                        className="flex-1 p-2 min-h-[60px] text-xs"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="mt-1 text-destructive"
                        onClick={() => {
                          const newPages = (
                            value.book_data?.pages || []
                          ).filter((_, i) => i !== idx);
                          updateField("book_data", {
                            ...value.book_data,
                            pages: newPages,
                          });
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 w-full h-8 text-xs"
                    onClick={() => {
                      const newPages = [...(value.book_data?.pages || []), ""];
                      updateField("book_data", {
                        ...value.book_data,
                        pages: newPages,
                      });
                    }}
                  >
                    <Plus className="w-4 h-4" /> Add Page
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* NBT */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="nbt-data">NBT Data (JSON/String)</Label>
              <span className="text-muted-foreground text-xs">Advanced</span>
            </div>
            <Textarea
              id="nbt-data"
              value={value.nbt || ""}
              onChange={(e) => updateField("nbt", e.target.value)}
              placeholder="{Display:{Name:'Test'}}"
              className="font-mono text-xs"
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
