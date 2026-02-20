import * as React from 'react';
import { X, ArrowRight } from 'lucide-react';
import { ChatInterface } from './ChatInterface';

/**
 * A full-screen overlay for performing research searches.
 * When closed, it unmounts or hides.
 */
export const SearchOverlay = ({ isOpen, onClose, initialQuery = '' }) => {
    if (!isOpen) return null;

    // Prevent background scrolling when open
    React.useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = '';
        };
    }, []);

    return (
        <div className="fixed inset-0 z-[99999] bg-white flex flex-col animate-in fade-in duration-300">
            {/* Header: Close Button */}
            <div className="flex justify-end p-6 border-b border-gray-100">
                <button
                    onClick={onClose}
                    className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-900"
                    aria-label="Close search"
                >
                    <X size={32} />
                </button>
            </div>

            {/* Main Content: Chat Interface */}
            <div className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 py-8 h-full overflow-hidden">
                <ChatInterface displayMode="fullscreen" initialQuery={initialQuery} onClose={onClose} />
            </div>
        </div>
    );
};
