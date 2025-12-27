import React from 'react';
import './YAMLPreview.css';

interface YAMLPreviewProps {
    yaml: string;
    className?: string;
}

export const YAMLPreview: React.FC<YAMLPreviewProps> = ({
    yaml,
    className = ''
}) => {
    const handleCopy = () => {
        navigator.clipboard.writeText(yaml);
        // Could add toast here
    };

    const handleDownload = () => {
        const blob = new Blob([yaml], { type: 'text/yaml' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'config.yml';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <div className={`yaml-preview ${className}`}>
            <div className="preview-header">
                <h3>Configuration Preview</h3>
                <div className="preview-actions">
                    <button onClick={handleCopy} className="action-btn" title="Copy to Clipboard">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                        Copy
                    </button>
                </div>
            </div>
            <div className="preview-content">
                <pre><code>{yaml || '# No configuration generated yet'}</code></pre>
            </div>
        </div>
    );
};
