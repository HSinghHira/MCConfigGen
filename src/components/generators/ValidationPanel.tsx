import React from 'react';
import type { ValidationError } from '@/lib/generators/shared/types';
import './ValidationPanel.css';

interface ValidationPanelProps {
    errors: ValidationError[];
    className?: string;
}

export const ValidationPanel: React.FC<ValidationPanelProps> = ({
    errors,
    className = ''
}) => {
    if (errors.length === 0) return null;

    return (
        <div className={`validation-panel ${className}`}>
            <div className="validation-header">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-500">
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                    <line x1="12" y1="9" x2="12" y2="13"></line>
                    <line x1="12" y1="17" x2="12.01" y2="17"></line>
                </svg>
                <span>Validation Issues ({errors.length})</span>
            </div>
            <ul className="error-list">
                {errors.map((error, index) => (
                    <li key={index} className={`error-item ${error.severity}`}>
                        <span className="error-path">{error.path}:</span>
                        <span className="error-message">{error.message}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};
