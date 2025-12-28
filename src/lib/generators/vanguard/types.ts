export type EvaluationType = 'EQUAL' | 'GREATER' | 'LESSER' | 'GREATER_EQUAL' | 'LESSER_EQUAL' | 'NOT_EQUAL';
export type RequirementValueType = 'NUMBER' | 'TEXT' | 'BOOLEAN';

export interface VanguardRequirement {
    id: string;
    type: RequirementValueType;
    placeholder: string;
    eval: EvaluationType;
    value: string | number | boolean;
    gui_message: string;
    deny_message: string;
}

export type CommandTemplateType =
    | 'LUCKPERMS_GROUP'
    | 'ECONOMY_REWARD'
    | 'TITLE_DISPLAY'
    | 'DISCORD_ANNOUNCEMENT'
    | 'KIT_PERMISSION'
    | 'CUSTOM';

export interface VanguardCommand {
    id: string;
    templateType: CommandTemplateType;
    command: string;
    permission_required?: string; // For 'perm_node: command' syntax
}

export interface VanguardRank {
    id: string;
    name: string;
    prefix: string; // Added from Wiki
    display_name: string;
    icon: {
        type: 'MATERIAL' | 'HEAD';
        material: string;
        amount: number;
        model_data?: number; // Added from Wiki
    };
    lore: string[];
    requirements: VanguardRequirement[];
    commands: VanguardCommand[];
    permissions: string[];
}

export interface VanguardConfig {
    ranks: Record<string, VanguardRank>;
    order: string[];
}
