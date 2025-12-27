export interface ValidationResult {
    valid: boolean;
    errors: ValidationError[];
}

export interface ValidationError {
    path: string;
    message: string;
    severity: 'error' | 'warning';
}

export interface GeneratorConfig<T> {
    id: string;
    name: string;
    initialState: T;
    validate: (config: T) => ValidationResult;
    generateYaml: (config: T) => string;
}

export interface GeneratorState {
    isValid: boolean;
    errors: ValidationError[];
    yaml: string;
}
