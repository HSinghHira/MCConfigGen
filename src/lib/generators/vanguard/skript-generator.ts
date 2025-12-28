import type { VanguardConfig } from './types';

export class VanguardSkriptGenerator {
    static generate(config: VanguardConfig): string {
        let skript = "# Vanguard Rank System - Installation Script\n";
        skript += "# Generated on: " + new Date().toLocaleString() + "\n\n";

        skript += "command /installranks:\n";
        skript += "    permission: op\n";
        skript += "    trigger:\n";
        skript += "        send \"&b&lVanguard &8» &7Starting rank installation...\" to player\n";

        config.order.forEach((rankId, index) => {
            const rank = config.ranks[rankId];
            if (!rank) return;

            skript += `\n        # Rank ${index + 1}: ${rank.name}\n`;
            skript += `        send \"&b&lVanguard &8» &7Creating rank &f${rank.display_name}&7...\" to player\n`;

            // Add permissions via LuckPerms
            rank.permissions.forEach(perm => {
                skript += `        execute console command \"lp group ${rank.name} permission set ${perm}\"\n`;
            });

            // Set display name metadata if needed or other Skript-based rank setup
            skript += `        send \"&b&lVanguard &8» &aRank ${rank.name} setup complete!\" to player\n`;
        });

        skript += "\n        send \"&b&lVanguard &8» &6&lAll ranks have been successfully installed!\" to player\n";

        return skript;
    }
}
