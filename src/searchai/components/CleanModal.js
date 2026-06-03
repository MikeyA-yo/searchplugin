import * as React from 'react';
import { X, Sparkles } from 'lucide-react';

export const CleanModal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100000] bg-white flex flex-col">
            {/* Header bar */}
            <div className="flex items-center justify-between px-6 py-3 border-b border-gray-200 bg-white flex-shrink-0">
                <div className="flex items-center gap-2">
                    <Sparkles size={16} className="text-red-600" />
                    <span className="font-bold text-gray-900 text-sm tracking-tight">
                        Coresight Research
                        <span className="text-gray-400 font-normal ml-1.5">| AI Search</span>
                    </span>
                </div>
                <button
                    onClick={onClose}
                    title="Close"
                    style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        border: '1px solid #E5E7EB',
                        background: 'white',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#6B7280',
                        flexShrink: 0,
                        padding: 0,
                        margin: 0,
                        lineHeight: 1,
                    }}
                >
                    <X size={18} />
                </button>
            </div>

            <div className="flex-1 overflow-hidden">
                {children}
            </div>
        </div>
    );
};

export default CleanModal;
