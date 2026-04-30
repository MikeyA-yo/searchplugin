import * as React from 'react';
import { X } from 'lucide-react';

// Simple, focused modal wrapper used by the search plugin UI.
export const CleanModal = ({ isOpen, onClose, children, maxWidth = '1200px' }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100000] bg-black/40 flex items-center justify-center p-6">
            <div className="absolute left-6 top-6">
                <button
                    onClick={onClose}
                    className="rounded-full bg-white/95 shadow flex items-center justify-center text-gray-800 hover:text-black hover:bg-white transition-all cursor-pointer"
                    style={{ width: '56px', height: '56px' }}
                    title="Close"
                >
                    <X size={32} strokeWidth={2.5} />
                </button>
            </div>

            <div className="w-full max-w-4xl h-[85vh] bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100 flex flex-col">
                {children}
            </div>
        </div>
    );
};

export default CleanModal;
