import * as React from 'react';
import { X } from 'lucide-react';

// Simple, focused modal wrapper used by the search plugin UI.
export const CleanModal = ({ isOpen, onClose, children, maxWidth = '1200px' }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100000] bg-white flex">
            <div className="absolute left-6 top-6 z-50">
                <button
                    onClick={onClose}
                    className="rounded-full bg-white border border-gray-200 shadow-md flex items-center justify-center text-gray-800 hover:text-black hover:bg-gray-50 transition-all cursor-pointer"
                    style={{ width: '56px', height: '56px' }}
                    title="Close"
                >
                    <X size={32} strokeWidth={2.5} />
                </button>
            </div>

            <div className="w-full h-full flex flex-col pt-24 pb-0 px-0 md:pt-0">
                {children}
            </div>
        </div>
    );
};

export default CleanModal;
