import React from "react";
import { useStore } from "@nanostores/react";
import {
  vanguardYamlStore,
  vanguardSkriptStore,
  vanguardConfigStore,
} from "@/lib/generators/vanguard/store";
import { Button } from "@/components/ui/button";
import { FileCode, FileJson, Book, ExternalLink } from "lucide-react";

export function DownloadButtons() {
  const yaml = useStore(vanguardYamlStore);
  const skript = useStore(vanguardSkriptStore);
  const config = useStore(vanguardConfigStore);

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
    <div className="flex items-center gap-2">
      <div className="flex items-center bg-muted/50 p-1 border rounded-lg overflow-hidden">
        <Button
          variant="ghost"
          size="sm"
          className="rounded-r-none h-8"
          onClick={() => downloadFile(yaml, "ranks.yml")}
        >
          <FileCode className="mr-2 w-4 h-4" /> YAML
        </Button>
        <div className="bg-border w-px h-4" />
        <Button
          variant="ghost"
          size="sm"
          className="rounded-l-none h-8"
          onClick={() => downloadFile(skript, "installranks.sk")}
        >
          <FileCode className="mr-2 w-4 h-4" /> Skript
        </Button>
      </div>

      <Button
        variant="outline"
        size="sm"
        className="h-9"
        onClick={() =>
          downloadFile(JSON.stringify(config, null, 2), "vanguard_config.json")
        }
      >
        <FileJson className="mr-2 w-4 h-4" /> Export JSON
      </Button>

      <a href="https://docs.zerun.com.br/" target="_blank" rel="noreferrer">
        <Button variant="outline" size="sm" className="h-9">
          <Book className="mr-2 w-4 h-4" /> Documentation
        </Button>
      </a>

      <a
        href="https://modrinth.com/plugin/vanguardranks/"
        target="_blank"
        rel="noreferrer"
      >
        <Button
          variant="default"
          size="sm"
          className="bg-blue-600 hover:bg-blue-700 h-9"
        >
          <ExternalLink className="mr-2 w-4 h-4" /> Get Plugin
        </Button>
      </a>
    </div>
  );
}
