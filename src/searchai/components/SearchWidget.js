import * as React from 'react';
import { Search, X, ArrowRight } from 'lucide-react';
import { createRoot } from '@wordpress/element';
import { ChatInterface } from './ChatInterface';

/**
 * Renders a full screen overlay for search results directly in the DOM.
 */
const SearchOverlay = ({ isOpen, onClose, initialQuery }) => {
    if (!isOpen) return null;

    React.useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = ''; };
    }, []);

    return (
        <div className="fixed inset-0 z-[100000] bg-white/95 backdrop-blur-sm animate-in fade-in duration-200 flex flex-col">
            <div className="flex justify-end p-6">
                 <button
                    onClick={onClose}
                    className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-900"
                >
                    <X size={32} />
                </button>
            </div>
            <div className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 pb-8 h-full overflow-hidden flex flex-col">
                 <ChatInterface displayMode="fullscreen" initialQuery={initialQuery} />
            </div>
        </div>
    );
};


export const SearchWidget = () => {
    const [isInputOpen, setIsInputOpen] = React.useState(false);
    const [isOverlayOpen, setIsOverlayOpen] = React.useState(false);
    const [query, setQuery] = React.useState('');
    const inputRef = React.useRef(null);

    // Focus input when opened
    React.useEffect(() => {
        if (isInputOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isInputOpen]);

    // Close on Escape key
    React.useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') {
                if (isOverlayOpen) setIsOverlayOpen(false);
                else setIsInputOpen(false);
            }
        };
        document.addEventListener('keydown', handleEsc);
        return () => document.removeEventListener('keydown', handleEsc);
    }, [isOverlayOpen]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!query.trim()) return;
        setIsInputOpen(false);
        setIsOverlayOpen(true);
    };

    return (
        <>
            {/* Floating Search Icon */}
            {!isInputOpen && !isOverlayOpen && (
                <button
                    onClick={() => setIsInputOpen(true)}
                    className="fixed right-4 h-11 w-11 bg-red-600 rounded-full text-white shadow-lg shadow-red-200/50 flex items-center justify-center hover:bg-red-700 hover:scale-110 hover:shadow-xl hover:shadow-red-300/50 transition-all duration-200 z-[9999]"
                    style={{ top: '36px' }}
                    aria-label="Open search"
                >
                    <Search size={20} />
                </button>
            )}

            {/* Search Input Overlay */}
            {isInputOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-black/30 backdrop-blur-md z-[9998] transition-opacity"
                        onClick={() => setIsInputOpen(false)}
                    />

                    {/* Search Bar */}
                    <div
                        className="fixed right-4 left-4 sm:left-auto sm:w-[520px] z-[9999]"
                        style={{ top: '36px' }}
                    >
                        <form
                            onSubmit={handleSubmit}
                            className="flex gap-4 items-center bg-white rounded-2xl shadow-2xl shadow-black/10 border border-gray-100 ring-1 ring-black/5 overflow-hidden p-2"
                        >
                            <div className="text-red-500">
                                <Search size={24} strokeWidth={2.5} />
                            </div>
                            <input
                                ref={inputRef}
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Search reports, trends, insights…"
                                className="flex-1 py-4 px-6 text-[16px] font-medium text-gray-800 placeholder-gray-400 bg-transparent border-none focus:outline-none focus:ring-0 tracking-tight"
                            />
                            <div className="flex items-center gap-4 pr-3">
                                {query.trim() && (
                                    <button
                                        type="submit"
                                        className="p-3 rounded-xl bg-red-600 text-white hover:bg-red-700 transition-all active:scale-95 shadow-sm shadow-red-200"
                                    >
                                        <ArrowRight size={20} />
                                    </button>
                                )}
                                <button
                                    type="button"
                                    onClick={() => setIsInputOpen(false)}
                                    className="p-3 rounded-xl bg-red-50 text-red-500 hover:text-red-700 hover:bg-red-100 transition-all ml-2"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                        </form>
                        <p className="text-[11px] text-gray-400 text-center mt-2.5 tracking-wide">
                            Press <kbd className="px-1.5 py-0.5 rounded bg-white/80 border border-gray-200 text-[10px] font-mono text-gray-500 shadow-sm">Enter</kbd> to search &middot; <kbd className="px-1.5 py-0.5 rounded bg-white/80 border border-gray-200 text-[10px] font-mono text-gray-500 shadow-sm">Esc</kbd> to close
                        </p>
                    </div>
                </>
            )}

            {/* Full Screen Overlay for Results */}
            {isOverlayOpen && (
                <SearchOverlay
                    isOpen={isOverlayOpen}
                    onClose={() => setIsOverlayOpen(false)}
                    initialQuery={query}
                />
            )}
        </>
    );
};
