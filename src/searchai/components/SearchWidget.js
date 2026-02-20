import * as React from 'react';
import { Search, X, ArrowRight } from 'lucide-react';

export const SearchWidget = () => {
    const [isOpen, setIsOpen] = React.useState(false);
    const [query, setQuery] = React.useState('');
    const inputRef = React.useRef(null);

    // Focus input when opened
    React.useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    // Close on Escape key
    React.useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') {
                setIsOpen(false);
            }
        };
        document.addEventListener('keydown', handleEsc);
        return () => document.removeEventListener('keydown', handleEsc);
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!query.trim()) return;
        const searchPageUrl =
            (window.searchaiSettings && window.searchaiSettings.searchPageUrl) ||
            '/coresight-search';
        window.location.href = `${searchPageUrl}?q=${encodeURIComponent(query.trim())}`;
    };

    return (
        <>
            {/* Floating Search Icon — top-right */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="fixed top-4 right-4 h-11 w-11 bg-red-600 rounded-full text-white shadow-lg flex items-center justify-center hover:bg-red-700 hover:scale-105 transition-all z-[9999]"
                    aria-label="Open search"
                >
                    <Search size={20} />
                </button>
            )}

            {/* Search Input Overlay */}
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[9998] transition-opacity"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Slim Search Bar — top-right */}
                    <div className="fixed top-4 right-4 left-4 sm:left-auto sm:w-[480px] z-[9999]">
                        <form
                            onSubmit={handleSubmit}
                            className="flex items-center bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden"
                        >
                            <div className="pl-4 text-gray-400">
                                <Search size={20} />
                            </div>
                            <input
                                ref={inputRef}
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Search Coresight research…"
                                className="flex-1 py-4 px-3 text-base text-gray-700 placeholder-gray-400 bg-transparent border-none focus:outline-none focus:ring-0"
                            />
                            {query.trim() && (
                                <button
                                    type="submit"
                                    className="mr-1 p-2.5 rounded-xl bg-red-600 text-white hover:bg-red-700 transition-all active:scale-95"
                                >
                                    <ArrowRight size={18} />
                                </button>
                            )}
                            <button
                                type="button"
                                onClick={() => setIsOpen(false)}
                                className="mr-3 text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </form>
                    </div>
                </>
            )}
        </>
    );
};
