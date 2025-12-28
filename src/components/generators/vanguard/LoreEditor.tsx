import React from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Palette, Info } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface LoreEditorProps {
  lore: string[];
  onChange: (lore: string[]) => void;
}

const COLORS = [
  { code: "&0", name: "Black", color: "#000000" },
  { code: "&1", name: "Dark Blue", color: "#0000AA" },
  { code: "&2", name: "Dark Green", color: "#00AA00" },
  { code: "&3", name: "Dark Aqua", color: "#00AAAA" },
  { code: "&4", name: "Dark Red", color: "#AA0000" },
  { code: "&5", name: "Dark Purple", color: "#AA00AA" },
  { code: "&6", name: "Gold", color: "#FFAA00" },
  { code: "&7", name: "Gray", color: "#AAAAAA" },
  { code: "&8", name: "Dark Gray", color: "#555555" },
  { code: "&9", name: "Blue", color: "#5555FF" },
  { code: "&a", name: "Green", color: "#55FF55" },
  { code: "&b", name: "Aqua", color: "#55FFFF" },
  { code: "&c", name: "Red", color: "#FF5555" },
  { code: "&d", name: "Light Purple", color: "#FF55FF" },
  { code: "&e", name: "Yellow", color: "#FFFF55" },
  { code: "&f", name: "White", color: "#FFFFFF" },
];

const FORMATS = [
  { code: "&l", name: "Bold" },
  { code: "&m", name: "Strikethrough" },
  { code: "&n", name: "Underline" },
  { code: "&o", name: "Italic" },
  { code: "&r", name: "Reset" },
];

export function LoreEditor({ lore, onChange }: LoreEditorProps) {
  const handleInsert = (code: string) => {
    const textarea = document.getElementById(
      "lore-textarea"
    ) as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const before = text.substring(0, start);
    const after = text.substring(end);

    const newText = before + code + after;
    onChange(newText.split("\n"));

    // Refocus and set cursor
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + code.length, start + code.length);
    }, 0);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Label>Rank Lore</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8">
              <Info className="mr-2 w-4 h-4" /> Color Codes
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="space-y-4">
              <div>
                <h4 className="mb-2 font-semibold text-sm">Colors</h4>
                <div className="gap-1 grid grid-cols-4">
                  {COLORS.map((c) => (
                    <button
                      key={c.code}
                      onClick={() => handleInsert(c.code)}
                      className="hover:bg-muted p-1 border rounded text-[10px]"
                      title={c.name}
                    >
                      <div
                        className="mb-1 rounded-sm w-full h-3"
                        style={{ backgroundColor: c.color }}
                      />
                      {c.code}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="mb-2 font-semibold text-sm">Formatting</h4>
                <div className="gap-1 grid grid-cols-3">
                  {FORMATS.map((f) => (
                    <button
                      key={f.code}
                      onClick={() => handleInsert(f.code)}
                      className="hover:bg-muted p-1 border rounded text-[10px]"
                    >
                      <span className="font-bold">{f.name}</span> ({f.code})
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <textarea
        id="lore-textarea"
        className="bg-background p-3 border rounded-md w-full min-h-[300px] font-mono text-sm resize-none"
        value={lore.join("\n")}
        onChange={(e) => onChange(e.target.value.split("\n"))}
        placeholder="&7First line&#10;&aSecond line"
      />

      <p className="text-muted-foreground text-xs italic">
        Tip: Click "Color Codes" for a quick reference. Ranks often include
        icons or descriptions here.
      </p>
    </div>
  );
}
