import { atom } from 'nanostores';
import type { VanguardConfig } from './types';

export const vanguardConfigStore = atom<VanguardConfig>({
    ranks: {
        'default': {
            id: 'default',
            name: 'rookie',
            prefix: '&8[&eROOKIE&8]',
            display_name: '&eRookie',
            icon: {
                type: 'MATERIAL',
                material: 'COBBLESTONE',
                amount: 1,
                model_data: 0
            },
            lore: [
                '&eRewards',
                ' ',
                '&7- &fAccess to %display_name% &7kit'
            ],
            requirements: [],
            commands: [
                {
                    id: 'cmd_1',
                    templateType: 'LUCKPERMS_GROUP',
                    command: 'lp user %player% permission set essentials.kits.%name% true'
                }
            ],
            permissions: []
        }
    },
    order: ['default']
});

export const vanguardYamlStore = atom<string>('');
export const vanguardSkriptStore = atom<string>('');
export const vanguardJsonStore = atom<string>('');
