import React from "react";
import { useStore } from "@nanostores/react";
import { vanguardConfigStore } from "@/lib/generators/vanguard/store";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { LoreEditor } from "./LoreEditor";
import { RequirementEditor } from "./RequirementEditor";
import { CommandEditor } from "./CommandEditor";

interface RankEditorProps {
  rankId: string;
}

export function RankEditor({ rankId }: RankEditorProps) {
  const config = useStore(vanguardConfigStore);
  const rank = config.ranks[rankId];

  if (!rank) return null;

  const updateRank = (updates: Partial<typeof rank>) => {
    vanguardConfigStore.set({
      ...config,
      ranks: {
        ...config.ranks,
        [rankId]: { ...rank, ...updates },
      },
    });
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold text-xl">
          Editing: {rank.display_name.replace(/&[0-9a-fklmnor]/gi, "")}
        </h2>
      </div>

      <Tabs
        defaultValue="basic"
        className="flex flex-col flex-1 overflow-hidden"
      >
        <TabsList className="grid grid-cols-5 mb-4 w-full">
          <TabsTrigger value="basic">Basic</TabsTrigger>
          <TabsTrigger value="lore">Lore</TabsTrigger>
          <TabsTrigger value="reqs">Reqs</TabsTrigger>
          <TabsTrigger value="cmds">Cmds</TabsTrigger>
          <TabsTrigger value="perms">Perms</TabsTrigger>
        </TabsList>

        <ScrollArea className="flex-1 pr-4">
          <TabsContent value="basic" className="space-y-4 m-0">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Internal Name (No spaces)</Label>
                <Input
                  value={rank.name}
                  onChange={(e) =>
                    updateRank({ name: e.target.value.replace(/\s+/g, "_") })
                  }
                  placeholder="novice"
                />
              </div>

              <div className="gap-4 grid grid-cols-2 mt-4">
                <div className="space-y-2">
                  <Label>Rank Prefix</Label>
                  <Input
                    value={rank.prefix}
                    onChange={(e) => updateRank({ prefix: e.target.value })}
                    placeholder="&8[&eROOKIE&8]"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Display Name</Label>
                  <Input
                    value={rank.display_name}
                    onChange={(e) =>
                      updateRank({ display_name: e.target.value })
                    }
                    placeholder="&7Novice"
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label>Icon Material</Label>
                <Input
                  value={rank.icon.material}
                  onChange={(e) =>
                    updateRank({
                      icon: {
                        ...rank.icon,
                        material: e.target.value.toUpperCase(),
                      },
                    })
                  }
                  placeholder="COAL"
                />
              </div>

              <div className="gap-4 grid grid-cols-3">
                <div className="space-y-2">
                  <Label>Amount</Label>
                  <Input
                    type="number"
                    min={1}
                    max={64}
                    value={rank.icon.amount}
                    onChange={(e) =>
                      updateRank({
                        icon: {
                          ...rank.icon,
                          amount: parseInt(e.target.value) || 1,
                        },
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Model Data</Label>
                  <Input
                    type="number"
                    value={rank.icon.model_data || 0}
                    onChange={(e) =>
                      updateRank({
                        icon: {
                          ...rank.icon,
                          model_data: parseInt(e.target.value) || 0,
                        },
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Icon Type</Label>
                  <select
                    className="bg-background px-3 py-2 border rounded-md w-full text-sm"
                    value={rank.icon.type}
                    onChange={(e) =>
                      updateRank({
                        icon: { ...rank.icon, type: e.target.value as any },
                      })
                    }
                  >
                    <option value="MATERIAL">Material</option>
                    <option value="HEAD">Custom Head</option>
                  </select>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="lore" className="m-0">
            <LoreEditor
              lore={rank.lore}
              onChange={(lore) => updateRank({ lore })}
            />
          </TabsContent>

          <TabsContent value="reqs" className="m-0">
            <RequirementEditor
              requirements={rank.requirements}
              onChange={(reqs) => updateRank({ requirements: reqs })}
            />
          </TabsContent>

          <TabsContent value="cmds" className="m-0">
            <CommandEditor
              commands={rank.commands}
              onChange={(cmds) => updateRank({ commands: cmds })}
              rankName={rank.name}
            />
          </TabsContent>

          <TabsContent value="perms" className="m-0">
            <div className="space-y-4">
              <Label>Permissions (One per line)</Label>
              <textarea
                className="bg-background p-3 border rounded-md w-full min-h-[200px] font-mono text-sm resize-none"
                value={rank.permissions.join("\n")}
                onChange={(e) =>
                  updateRank({
                    permissions: e.target.value
                      .split("\n")
                      .filter((p) => p.trim() !== ""),
                  })
                }
                placeholder="vanguard.rank.novice&#10;essentials.fly"
              />
            </div>
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </div>
  );
}
