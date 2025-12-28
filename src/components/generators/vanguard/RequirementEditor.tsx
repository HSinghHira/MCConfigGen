import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Zap } from "lucide-react";
import type {
  VanguardRequirement,
  EvaluationType,
  RequirementValueType,
} from "@/lib/generators/vanguard/types";
import { Card } from "@/components/ui/card";

interface RequirementEditorProps {
  requirements: VanguardRequirement[];
  onChange: (reqs: VanguardRequirement[]) => void;
}

const TEMPLATES = [
  {
    name: "Playtime",
    placeholder: "%statistic_play_one_minute%",
    type: "NUMBER" as const,
    value: 60,
    eval: "GREATER" as const,
    gui: "&7Playtime: &f{current}/{required}",
    deny: "&cYou need more playtime!",
  },
  {
    name: "Money",
    placeholder: "%vault_eco_balance%",
    type: "NUMBER" as const,
    value: 1000,
    eval: "GREATER" as const,
    gui: "&7Money: &a${current}/${required} %status%",
    deny: "&7You need to have more money than &c$%formatter_number_shorten_{required}%",
  },
  {
    name: "Kills",
    placeholder: "%statistic_player_kills%",
    type: "NUMBER" as const,
    value: 50,
    eval: "GREATER" as const,
    gui: "&7Kills: &f{current}/{required}",
    deny: "&cYou need more kills!",
  },
  {
    name: "Level",
    placeholder: "%player_level%",
    type: "NUMBER" as const,
    value: 10,
    eval: "GREATER" as const,
    gui: "&7Level: &f{current}/{required}",
    deny: "&cYou need a higher level!",
  },
];

const EVAL_METHODS: EvaluationType[] = [
  "EQUAL",
  "GREATER",
  "LESSER",
  "GREATER_EQUAL",
  "LESSER_EQUAL",
  "NOT_EQUAL",
];
const VALUE_TYPES: RequirementValueType[] = ["NUMBER", "TEXT", "BOOLEAN"];

export function RequirementEditor({
  requirements,
  onChange,
}: RequirementEditorProps) {
  const addRequirement = (template?: (typeof TEMPLATES)[0]) => {
    const newReq: VanguardRequirement = {
      id: `req_${Date.now()}`,
      type: template?.type || "NUMBER",
      placeholder: template?.placeholder || "",
      eval: template?.eval || "EQUAL",
      value: template?.value || 0,
      gui_message: template?.gui || "",
      deny_message: template?.deny || "",
    };
    onChange([...requirements, newReq]);
  };

  const updateReq = (id: string, updates: Partial<VanguardRequirement>) => {
    onChange(requirements.map((r) => (r.id === id ? { ...r, ...updates } : r)));
  };

  const deleteReq = (id: string) => {
    onChange(requirements.filter((r) => r.id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {TEMPLATES.map((t) => (
          <Button
            key={t.name}
            variant="outline"
            size="sm"
            onClick={() => addRequirement(t)}
          >
            <Zap className="mr-2 w-3 h-3" /> {t.name}
          </Button>
        ))}
        <Button variant="secondary" size="sm" onClick={() => addRequirement()}>
          <Plus className="mr-2 w-3 h-3" /> Custom
        </Button>
      </div>

      <div className="space-y-4">
        {requirements.map((req) => (
          <Card key={req.id} className="group relative p-4">
            <Button
              variant="ghost"
              size="icon"
              className="top-2 right-2 absolute opacity-0 group-hover:opacity-100 w-8 h-8"
              onClick={() => deleteReq(req.id)}
            >
              <Trash2 className="w-4 h-4 text-destructive" />
            </Button>

            <div className="gap-4 grid grid-cols-1 md:grid-cols-2">
              <div className="space-y-2 col-span-2 md:col-span-1">
                <Label className="text-xs">Placeholder</Label>
                <Input
                  value={req.placeholder}
                  onChange={(e) =>
                    updateReq(req.id, { placeholder: e.target.value })
                  }
                  placeholder="%placeholder%"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs">Value Type</Label>
                <select
                  className="bg-background px-3 py-2 border rounded-md w-full text-sm"
                  value={req.type}
                  onChange={(e) =>
                    updateReq(req.id, { type: e.target.value as any })
                  }
                >
                  {VALUE_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label className="text-xs">Evaluation Method</Label>
                <select
                  className="bg-background px-3 py-2 border rounded-md w-full text-sm"
                  value={req.eval}
                  onChange={(e) =>
                    updateReq(req.id, { eval: e.target.value as any })
                  }
                >
                  {EVAL_METHODS.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label className="text-xs">Required Value</Label>
                <Input
                  value={req.value.toString()}
                  onChange={(e) => {
                    let val: string | number | boolean = e.target.value;
                    if (req.type === "NUMBER")
                      val = parseFloat(e.target.value) || 0;
                    if (req.type === "BOOLEAN")
                      val = e.target.value.toLowerCase() === "true";
                    updateReq(req.id, { value: val });
                  }}
                />
              </div>

              <div className="space-y-2 col-span-2">
                <Label className="text-xs">GUI Message</Label>
                <Input
                  value={req.gui_message}
                  onChange={(e) =>
                    updateReq(req.id, { gui_message: e.target.value })
                  }
                  placeholder="&7Progress: &f%current%/%required%"
                />
              </div>
              <div className="space-y-2 col-span-2">
                <Label className="text-xs">Deny Message</Label>
                <Input
                  value={req.deny_message}
                  onChange={(e) =>
                    updateReq(req.id, { deny_message: e.target.value })
                  }
                  placeholder="&cYou cannot do this yet!"
                />
              </div>
            </div>
          </Card>
        ))}

        {requirements.length === 0 && (
          <div className="py-8 border-2 border-dashed rounded-lg text-muted-foreground text-center">
            No requirements added. All players can obtain this rank.
          </div>
        )}
      </div>
    </div>
  );
}
