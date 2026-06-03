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
                    className="p-1.5 rounded-full text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors cursor-pointer"
                    title="Close"
                >
                    <X size={20} />
                </button>
            </div>

            <div className="flex-1 overflow-hidden">
                {children}
            </div>
        </div>
    );
};

export default CleanModal;
