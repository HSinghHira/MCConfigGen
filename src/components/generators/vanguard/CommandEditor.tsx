import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Zap, Terminal, Shield } from "lucide-react";
import type {
  VanguardCommand,
  CommandTemplateType,
} from "@/lib/generators/vanguard/types";
import { Card } from "@/components/ui/card";

interface CommandEditorProps {
  commands: VanguardCommand[];
  onChange: (cmds: VanguardCommand[]) => void;
  rankName: string;
}

const TEMPLATES = [
  {
    name: "LuckPerms",
    template: "lp user %player% parent set {rankName}",
    type: "LUCKPERMS_GROUP",
  },
  {
    name: "Economy",
    template: "eco give %player% 1000",
    type: "ECONOMY_REWARD",
  },
  {
    name: "Title",
    template: 'title %player% title "{displayName}"',
    type: "TITLE_DISPLAY",
  },
  {
    name: "Discord",
    template: "discord: :medal: %player% has reached {displayName}!",
    type: "DISCORD_ANNOUNCEMENT",
  },
];

export function CommandEditor({
  commands,
  onChange,
  rankName,
}: CommandEditorProps) {
  const addCommand = (template?: (typeof TEMPLATES)[0]) => {
    const newCmd: VanguardCommand = {
      id: `cmd_${Date.now()}`,
      templateType: (template?.type as CommandTemplateType) || "CUSTOM",
      command: template?.template.replace("{rankName}", rankName) || "",
    };
    onChange([...commands, newCmd]);
  };

  const updateCmd = (id: string, updates: Partial<VanguardCommand>) => {
    onChange(commands.map((c) => (c.id === id ? { ...c, ...updates } : c)));
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {TEMPLATES.map((t) => (
          <Button
            key={t.name}
            variant="outline"
            size="sm"
            onClick={() => addCommand(t)}
          >
            <Terminal className="mr-2 w-3 h-3" /> {t.name}
          </Button>
        ))}
        <Button variant="secondary" size="sm" onClick={() => addCommand()}>
          <Plus className="mr-2 w-3 h-3" /> Custom
        </Button>
      </div>

      <div className="space-y-4">
        {commands.map((cmd) => (
          <Card key={cmd.id} className="group relative p-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onChange(commands.filter((c) => c.id !== cmd.id))}
              className="top-2 right-2 absolute opacity-0 group-hover:opacity-100 w-8 h-8 hover:text-destructive"
            >
              <Trash2 className="w-4 h-4" />
            </Button>

            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <div className="bg-muted p-1.5 rounded-md">
                  <Terminal className="w-4 h-4 text-muted-foreground" />
                </div>
                <Input
                  value={cmd.command}
                  onChange={(e) =>
                    updateCmd(cmd.id, { command: e.target.value })
                  }
                  placeholder="command to execute..."
                  className="font-mono text-sm"
                />
              </div>

              <div className="flex items-center space-x-2">
                <div className="bg-muted p-1.5 rounded-md">
                  <Shield className="w-4 h-4 text-muted-foreground" />
                </div>
                <Input
                  value={cmd.permission_required || ""}
                  onChange={(e) =>
                    updateCmd(cmd.id, { permission_required: e.target.value })
                  }
                  placeholder="Optional: Required permission node (e.g. perm_rank.vip)"
                  className="text-xs"
                />
              </div>
              {cmd.permission_required && (
                <p className="px-1 text-[10px] text-muted-foreground italic">
                  The command will only run if the player has this permission.
                  Use ; for OR, , for AND.
                </p>
              )}
            </div>
          </Card>
        ))}

        {commands.length === 0 && (
          <div className="py-8 border-2 border-dashed rounded-lg text-muted-foreground text-center">
            No commands added.
          </div>
        )}
      </div>
    </div>
  );
}
