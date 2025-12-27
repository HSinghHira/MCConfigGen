import React, { useState } from 'react';
import './QuickReference.css';

interface QuickReferenceProps {
    items: { title: string; content: React.ReactNode }[];
    className?: string;
}

export const QuickReference: React.FC<QuickReferenceProps> = ({
    items,
    className = ''
}) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className={`quick-reference ${className}`}>
            <button
                className="toggle-btn"
                onClick={() => setIsOpen(!isOpen)}
                title="Toggle Quick Reference"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                <span className="sr-only">Help</span>
            </button>

            {isOpen && (
                <div className="reference-panel">
                    <div className="panel-header">
                        <h3>Quick Reference</h3>
                        <button onClick={() => setIsOpen(false)} className="close-btn">&times;</button>
                    </div>
                    <div className="panel-content">
                        {items.map((item, index) => (
                            <div key={index} className="reference-item">
                                <h4>{item.title}</h4>
                                <div className="item-content">{item.content}</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
