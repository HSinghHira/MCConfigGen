import type { ValidationError } from './types';

export class Validator {
    private errors: ValidationError[] = [];

    constructor() {
        this.errors = [];
    }

    addError(path: string, message: string) {
        this.errors.push({
            path,
            message,
            severity: 'error'
        });
    }

    addWarning(path: string, message: string) {
        this.errors.push({
            path,
            message,
            severity: 'warning'
        });
    }

    getErrors(): ValidationError[] {
        return this.errors;
    }

    isValid(): boolean {
        return !this.errors.some(e => e.severity === 'error');
    }

    // Common validators
    required(value: any, path: string, message: string = 'Field is required') {
        if (value === undefined || value === null || value === '') {
            this.addError(path, message);
        }
    }

    min(value: number, min: number, path: string, message?: string) {
        if (value < min) {
            this.addError(path, message || `Value must be at least ${min}`);
        }
    }

    max(value: number, max: number, path: string, message?: string) {
        if (value > max) {
            this.addError(path, message || `Value must be at most ${max}`);
        }
    }
}
