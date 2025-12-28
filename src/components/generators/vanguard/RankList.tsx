import React from "react";
import { useStore } from "@nanostores/react";
import { vanguardConfigStore } from "@/lib/generators/vanguard/store";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Layers, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface RankListProps {
  activeId: string;
  onSelect: (id: string) => void;
}

export function RankList({ activeId, onSelect }: RankListProps) {
  const config = useStore(vanguardConfigStore);

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (config.order.length <= 1) return;

    const newRanks = { ...config.ranks };
    delete newRanks[id];
    const newOrder = config.order.filter((oid) => oid !== id);

    vanguardConfigStore.set({
      ...config,
      ranks: newRanks,
      order: newOrder,
    });

    if (activeId === id) {
      onSelect(newOrder[0]);
    }
  };

  return (
    <div className="space-y-2">
      {config.order.map((id, index) => {
        const rank = config.ranks[id];
        if (!rank) return null;

        return (
          <div
            key={id}
            onClick={() => onSelect(id)}
            className={cn(
              "flex justify-between items-center hover:bg-muted/50 p-3 border rounded-lg transition-all cursor-pointer",
              activeId === id
                ? "border-primary bg-primary/5 shadow-sm"
                : "border-transparent"
            )}
          >
            <div className="flex items-center space-x-3 overflow-hidden">
              <span className="font-mono text-muted-foreground text-xs">
                #{index + 1}
              </span>
              <div className="flex flex-col min-w-0">
                <span className="font-medium text-sm truncate">
                  <span className="opacity-70 mr-1 text-xs">
                    {rank.prefix.replace(/&[0-9a-fklmnor]/gi, "")}
                  </span>
                  {rank.display_name.replace(/&[0-9a-fklmnor]/gi, "")}
                </span>
                <span className="text-muted-foreground text-xs truncate">
                  {rank.name}
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {rank.requirements.length > 0 && (
                <Badge variant="secondary" className="px-1.5 h-5 text-[10px]">
                  Req: {rank.requirements.length}
                </Badge>
              )}
              {rank.commands.length > 0 && (
                <Badge variant="outline" className="px-1.5 h-5 text-[10px]">
                  Cmd: {rank.commands.length}
                </Badge>
              )}
              <Button
                variant="ghost"
                size="icon"
                className="opacity-0 group-hover:opacity-100 w-7 h-7 hover:text-destructive"
                onClick={(e) => handleDelete(e, id)}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
