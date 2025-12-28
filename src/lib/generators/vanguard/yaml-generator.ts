import { YamlBuilder } from '@/lib/generators/shared/yaml-builder';
import type { VanguardConfig } from './types';

export class VanguardYamlGenerator {
    static generate(config: VanguardConfig): string {
        const ranksData: Record<string, any> = {};

        config.order.forEach(rankId => {
            const rank = config.ranks[rankId];
            if (!rank) return;

            const requirements: Record<string, any> = {};
            rank.requirements.forEach(req => {
                requirements[req.placeholder] = {
                    type: req.type,
                    eval: req.eval,
                    value: req.value,
                    gui_message: req.gui_message,
                    deny_message: req.deny_message
                };
            });

            ranksData[rank.name] = {
                prefix: rank.prefix,
                display_name: rank.display_name,
                icon: rank.icon.material,
                icon_amount: rank.icon.amount,
                icon_model_data: rank.icon.model_data || 0,
                lore: rank.lore,
                requirements: Object.keys(requirements).length > 0 ? requirements : undefined,
                commands: rank.commands.map(cmd => {
                    if (cmd.permission_required) {
                        return `${cmd.permission_required}: ${cmd.command}`;
                    }
                    return cmd.command;
                }),
                // Permissions are separate in LP, but Wiki says configuration handles ranks. 
                // Based on Wiki example, permissions aren't in YAML, but LuckPerms is mentioned in features.
                // Keeping them for internal config/JSON but omitting from YAML if not specified in Wiki.
            };
        });

        return YamlBuilder.toString(ranksData);
    }
}
