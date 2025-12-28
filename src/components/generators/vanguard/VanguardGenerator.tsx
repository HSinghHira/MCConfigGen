import React, { useState, useEffect } from "react";
import { useStore } from "@nanostores/react";
import {
  vanguardConfigStore,
  vanguardYamlStore,
  vanguardSkriptStore,
} from "@/lib/generators/vanguard/store";
import { VanguardYamlGenerator } from "@/lib/generators/vanguard/yaml-generator";
import { VanguardSkriptGenerator } from "@/lib/generators/vanguard/skript-generator";
import { YAMLPreview } from "@/components/generators/YAMLPreview";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Plus, Download, FileJson, FileCode } from "lucide-react";
import { RankList } from "@/components/generators/vanguard/RankList";
import { RankEditor } from "@/components/generators/vanguard/RankEditor";

export default function VanguardGenerator() {
  const config = useStore(vanguardConfigStore);
  const yaml = useStore(vanguardYamlStore);
  const skript = useStore(vanguardSkriptStore);
  const [activeRankId, setActiveRankId] = useState(config.order[0] || "");
  const [activeTab, setActiveTab] = useState("yaml");

  useEffect(() => {
    const generatedYaml = VanguardYamlGenerator.generate(config);
    const generatedSkript = VanguardSkriptGenerator.generate(config);
    vanguardYamlStore.set(generatedYaml);
    vanguardSkriptStore.set(generatedSkript);
  }, [config]);

  const handleAddRank = () => {
    const newId = `rank_${Date.now()}`;
    const newRank = {
      id: newId,
      name: "new_rank",
      prefix: "&f[NEW]",
      display_name: "&fNew Rank",
      icon: {
        type: "MATERIAL" as const,
        material: "COAL",
        amount: 1,
        model_data: 0,
      },
      lore: ["&7A new rank."],
      requirements: [],
      commands: [],
      permissions: [],
    };

    vanguardConfigStore.set({
      ...config,
      ranks: { ...config.ranks, [newId]: newRank },
      order: [...config.order, newId],
    });
    setActiveRankId(newId);
  };

  const downloadFile = (content: string, filename: string) => {
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="gap-6 grid grid-cols-1 lg:grid-cols-12 h-[calc(100vh-12rem)]">
      {/* Left Sidebar: Rank List */}
      <div className="flex flex-col space-y-4 lg:col-span-3">
        <Card className="flex flex-col flex-1 p-4 overflow-hidden">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold text-lg">Ranks</h2>
            <Button size="sm" onClick={handleAddRank}>
              <Plus className="mr-2 w-4 h-4" /> New Rank
            </Button>
          </div>
          <ScrollArea className="flex-1">
            <RankList activeId={activeRankId} onSelect={setActiveRankId} />
          </ScrollArea>
        </Card>
      </div>

      {/* Middle: Rank Editor */}
      <div className="flex flex-col space-y-4 lg:col-span-5">
        <Card className="flex flex-col flex-1 p-4 overflow-hidden">
          {activeRankId ? (
            <RankEditor rankId={activeRankId} />
          ) : (
            <div className="flex flex-1 justify-center items-center text-muted-foreground">
              Select or create a rank to start editing
            </div>
          )}
        </Card>
      </div>

      {/* Right: Preview */}
      <div className="flex flex-col space-y-4 lg:col-span-4">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="flex flex-col flex-1"
        >
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="yaml">YAML (ranks.yml)</TabsTrigger>
            <TabsTrigger value="skript">Skript (install.sk)</TabsTrigger>
          </TabsList>
          <div className="flex-1 mt-4 h-full overflow-hidden">
            <TabsContent value="yaml" className="m-0 h-full">
              <Card className="h-full overflow-hidden">
                <YAMLPreview yaml={yaml} />
              </Card>
            </TabsContent>
            <TabsContent value="skript" className="m-0 h-full">
              <Card className="p-4 h-full overflow-auto">
                <pre className="font-mono text-sm whitespace-pre-wrap">
                  {skript}
                </pre>
              </Card>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
