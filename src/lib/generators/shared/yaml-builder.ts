import yaml from 'js-yaml';

export class YamlBuilder {
    static toString(data: any): string {
        return yaml.dump(data, {
            indent: 2,
            lineWidth: -1, // Don't wrap lines
            noRefs: true,
            quotingType: '"',
            sortKeys: false // Preserve key order
        });
    }

    static parse(content: string): any {
        try {
            return yaml.load(content);
        } catch (e) {
            console.error('YAML Parse Error:', e);
            return null;
        }
    }
}
