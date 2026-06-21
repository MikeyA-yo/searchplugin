import * as React from 'react';
import { Search, Sparkles, ChevronDown, ChevronUp, Loader, X, FileText, PlayCircle, Mic, LayoutGrid } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { ResearchCard } from './ResearchCard';

const TYPE_FILTERS = [
    { label: 'Reports', icon: FileText, red: true },
    { label: 'Video', icon: PlayCircle, red: true },
    { label: 'Podcast', icon: Mic, red: false },
    { label: 'Infographic', icon: LayoutGrid, red: false },
];

const DROPDOWN_LABELS = ['Report Type', 'Sector', 'Theme', 'Region', 'Company', 'Company Type'];

const SECTORS_LIST = [
    'retail', 'e-commerce', 'ecommerce', 'apparel', 'footwear', 'beauty', 'grocery', 'luxury', 
    'home', 'electronics', 'department stores', 'automotive', 'discount', 'drugstores', 
    'restaurants', 'delivery', 'cpg', 'consumer packaged goods', 'fashion', 'sportswear'
];
const THEMES_LIST = [
    'sustainability', 'generative ai', 'ai', 'technology', 'inflation', 'holiday', 'consumer trends', 
    'supply chain', 'omnichannel', 'live streaming', 'social commerce', 'metaverse', 'macroeconomics', 
    'labor', 'payments', 'metaverse', 'web3', 'sourcing', 'logistics', 'inventory'
];
const REGIONS_LIST = [
    'us', 'usa', 'china', 'europe', 'asia', 'global', 'uk', 'india', 'north america', 'apac', 'emea',
    'united states', 'united kingdom', 'germany', 'france', 'japan', 'latam'
];
const COMPANIES_LIST = [
    'walmart', 'amazon', 'target', 'alibaba', 'jd.com', 'macy\'s', 'macys', 'nordstrom', 'kroger', 
    'costco', 'shein', 'temu', 'inditex', 'h&m', 'nike', 'adidas', 'sephora', 'l\'oreal', 'loreal',
    'apple', 'google', 'meta', 'microsoft', 'shopify', 'salesforce'
];
const COMPANY_TYPES_LIST = [
    'retailer', 'brand', 'technology provider', 'startup', 'conglomerate', 'enabler', 'platform'
];

export const SummaryView = ({ initialQuery = '', displayMode = 'inline' }) => {
    const [query, setQuery] = React.useState(initialQuery);
    const [inputValue, setInputValue] = React.useState(initialQuery);
    const [summary, setSummary] = React.useState(null);
    const [researchResults, setResearchResults] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(false);
    const [error, setError] = React.useState(null);
    const [hasSearched, setHasSearched] = React.useState(false);
    const [isSummaryExpanded, setIsSummaryExpanded] = React.useState(false);
    const [activeTypeFilter, setActiveTypeFilter] = React.useState(null);
    const [openDropdown, setOpenDropdown] = React.useState(null);
    const [selectedFilters, setSelectedFilters] = React.useState({
        'Report Type': null,
        'Sector': null,
        'Theme': null,
        'Region': null,
        'Company': null,
        'Company Type': null
    });

    const dropdownRef = React.useRef(null);

    React.useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setOpenDropdown(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const options = React.useMemo(() => {
        const sectorOptions = new Set();
        const themeOptions = new Set();
        const regionOptions = new Set();
        const companyOptions = new Set();
        const companyTypeOptions = new Set();
        const reportTypeOptions = new Set();

        researchResults.forEach(article => {
            if (article.category) reportTypeOptions.add(article.category);
            if (article.badge) reportTypeOptions.add(article.badge);

            const allTags = article.tags || [];
            allTags.forEach(tag => {
                const tagLower = tag.toLowerCase().trim();
                if (SECTORS_LIST.includes(tagLower)) {
                    sectorOptions.add(tag);
                } else if (THEMES_LIST.includes(tagLower)) {
                    themeOptions.add(tag);
                } else if (REGIONS_LIST.includes(tagLower)) {
                    regionOptions.add(tag);
                } else if (COMPANIES_LIST.includes(tagLower)) {
                    companyOptions.add(tag);
                } else if (COMPANY_TYPES_LIST.includes(tagLower)) {
                    companyTypeOptions.add(tag);
                } else {
                    if (tag.charAt(0) === tag.charAt(0).toUpperCase()) {
                        themeOptions.add(tag);
                    }
                }
            });
        });

        return {
            'Report Type': Array.from(reportTypeOptions).sort(),
            'Sector': Array.from(sectorOptions).sort(),
            'Theme': Array.from(themeOptions).sort(),
            'Region': Array.from(regionOptions).sort(),
            'Company': Array.from(companyOptions).sort(),
            'Company Type': Array.from(companyTypeOptions).sort()
        };
    }, [researchResults]);

    const apiBaseUrl = (window.searchaiSettings && window.searchaiSettings.apiBaseUrl) || 'https://coresight-chat-backend.vercel.app';

    const handleSearch = async (searchQuery) => {
        if (!searchQuery.trim()) return;

        setIsLoading(true);
        setError(null);
        setSummary(null);
        setResearchResults([]);
        setHasSearched(true);
        setIsSummaryExpanded(false);
        setActiveTypeFilter(null);

        try {
            const res = await fetch(`${apiBaseUrl}/search/plugin`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: searchQuery, history: [] }),
            });

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                throw new Error(errorData.details || `Request failed: ${res.status}`);
            }

            const data = await res.json();
            const normalizedArticles = Array.isArray(data.articles)
                ? data.articles.map((article) => ({
                    title: article.title,
                    url: article.url,
                    summary: article.summary,
                    date: article.date,
                    tags: article.tags,
                    category: article.category,
                    badge: article.badge,
                    image_url: article.image_url || article.imageUrl || ''
                }))
                : [];

            setSummary(data.response ?? 'No summary available');
            setResearchResults(normalizedArticles);
        } catch (err) {
            setError(`Connection Error: ${err.message}`);
            console.error('Search failed:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        if (inputValue.trim()) {
            setQuery(inputValue);
            handleSearch(inputValue);
        }
    };

    React.useEffect(() => {
        if (initialQuery && !hasSearched) {
            setInputValue(initialQuery);
            setQuery(initialQuery);
            handleSearch(initialQuery);
        }
    }, [initialQuery, hasSearched]);

    const filteredResults = React.useMemo(() => {
        return researchResults.filter((article) => {
            // 1. Type Filter (Reports, Video, Podcast, Infographic)
            if (activeTypeFilter) {
                const cat = (article.category || '').toLowerCase();
                const badge = (article.badge || '').toLowerCase();
                const tags = (article.tags || []).map((t) => t.toLowerCase());
                
                const matchQuery = activeTypeFilter.toLowerCase();
                const baseQuery = matchQuery.endsWith('s') ? matchQuery.slice(0, -1) : matchQuery;
                
                const matchesCat = cat.includes(baseQuery);
                const matchesBadge = badge.includes(baseQuery);
                const matchesTags = tags.some((t) => t.includes(baseQuery));
                
                if (!matchesCat && !matchesBadge && !matchesTags) {
                    return false;
                }
            }

            // 2. Dropdown Filters
            if (selectedFilters['Report Type']) {
                const val = selectedFilters['Report Type'];
                if (article.category !== val && article.badge !== val) {
                    return false;
                }
            }

            const dropdownFields = ['Sector', 'Theme', 'Region', 'Company', 'Company Type'];
            for (const field of dropdownFields) {
                if (selectedFilters[field]) {
                    const val = selectedFilters[field].toLowerCase().trim();
                    const tags = (article.tags || []).map((t) => t.toLowerCase().trim());
                    if (!tags.includes(val)) return false;
                }
            }

            return true;
        });
    }, [researchResults, activeTypeFilter, selectedFilters]);

    return (
        <div className="flex flex-col bg-white h-full w-full overflow-hidden">
            {/* Search Bar */}
            <div className="px-6 py-4 border-b border-gray-100 bg-white flex-shrink-0">
                <form onSubmit={handleFormSubmit} style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                    <Search
                        size={17}
                        style={{ position: 'absolute', left: '14px', color: '#9CA3AF', pointerEvents: 'none', flexShrink: 0 }}
                    />
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Search Coresight Research..."
                        disabled={isLoading}
                        style={{
                            width: '100%',
                            paddingLeft: '42px',
                            paddingRight: inputValue ? '40px' : '14px',
                            paddingTop: '10px',
                            paddingBottom: '10px',
                            borderRadius: '12px',
                            border: '1px solid #E5E7EB',
                            outline: 'none',
                            fontSize: '14px',
                            color: '#111827',
                            background: isLoading ? '#F9FAFB' : 'white',
                            boxSizing: 'border-box',
                        }}
                    />
                    {inputValue && (
                        <button
                            type="button"
                            onClick={() => setInputValue('')}
                            style={{
                                position: 'absolute',
                                right: '12px',
                                background: 'none',
                                border: 'none',
                                padding: '0',
                                margin: '0',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                color: '#9CA3AF',
                                lineHeight: 1,
                            }}
                        >
                            <X size={17} />
                        </button>
                    )}
                </form>
            </div>

            {/* Scrollable Results */}
            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6 bg-white">
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700">
                        <p className="font-semibold text-sm">Error</p>
                        <p className="text-sm">{error}</p>
                    </div>
                )}

                {isLoading && (
                    <div className="flex flex-col items-center justify-center py-20 space-y-4">
                        <div className="relative w-12 h-12">
                            <div className="absolute inset-0 bg-red-200 rounded-full animate-pulse" />
                            <div className="absolute inset-2 bg-red-100 rounded-full animate-pulse" style={{ animationDelay: '150ms' }} />
                            <Sparkles className="absolute inset-0 m-auto text-red-600 animate-bounce" size={24} />
                        </div>
                        <p className="text-gray-600 font-medium text-sm">Searching Coresight Research Library...</p>
                    </div>
                )}

                {hasSearched && !isLoading && summary && (
                    <>
                        {/* AI Overview Card */}
                        <div className="border border-gray-200 rounded-xl p-5 bg-white shadow-sm">
                            <div className="flex items-center gap-2 mb-3">
                                <Sparkles size={15} className="text-red-600 flex-shrink-0" />
                                <span className="font-bold text-gray-900 text-sm">AI Overview</span>
                            </div>
                            <div className={`prose prose-sm max-w-none text-gray-700 overflow-hidden transition-all duration-300 ${isSummaryExpanded ? '' : 'line-clamp-3'}`}>
                                <ReactMarkdown
                                    components={{
                                        a: ({ node, ...props }) => (
                                            <a
                                                {...props}
                                                className="text-red-600 font-semibold underline underline-offset-4 hover:text-red-800 transition-colors"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            />
                                        ),
                                        p: ({ node, ...props }) => <p {...props} className="mb-2 text-gray-700 leading-relaxed text-sm" />,
                                        ul: ({ node, ...props }) => <ul {...props} className="list-disc list-inside mb-2 text-gray-700 text-sm" />,
                                        ol: ({ node, ...props }) => <ol {...props} className="list-decimal list-inside mb-2 text-gray-700 text-sm" />,
                                    }}
                                >
                                    {summary}
                                </ReactMarkdown>
                            </div>
                            <div className="flex justify-center mt-4 pt-3 border-t border-gray-100">
                                <button
                                    onClick={() => setIsSummaryExpanded(!isSummaryExpanded)}
                                    className="text-red-600 hover:text-red-800 text-sm flex items-center gap-1.5 border border-red-300 rounded-full px-5 py-1.5 hover:bg-red-50 transition-colors cursor-pointer"
                                >
                                    {isSummaryExpanded ? (
                                        <>Show less <ChevronUp size={14} /></>
                                    ) : (
                                        <>Show more <ChevronDown size={14} /></>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Results Section */}
                        {researchResults.length > 0 && (
                            <div>
                                {/* Section Title */}
                                <h3 className="font-bold text-gray-900 text-sm mb-3">
                                    All results matching &ldquo;{query}&rdquo;
                                </h3>

                                {/* Filter Row */}
                                <div ref={dropdownRef} className="flex flex-wrap items-center gap-2 mb-2">
                                    {TYPE_FILTERS.map(({ label, icon: Icon, red }) => {
                                        const isActive = activeTypeFilter === label.toLowerCase();
                                        return (
                                            <button
                                                key={label}
                                                type="button"
                                                onClick={() => {
                                                    setActiveTypeFilter(isActive ? null : label.toLowerCase());
                                                }}
                                                style={{
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    gap: '6px',
                                                    padding: '6px 14px',
                                                    borderRadius: '9999px',
                                                    border: isActive ? '1px solid #d62e2f' : '1px solid #D1D5DB',
                                                    background: isActive ? '#fef2f2' : 'white',
                                                    fontSize: '12px',
                                                    fontWeight: 600,
                                                    color: isActive ? '#d62e2f' : (red ? '#d62e2f' : '#6B7280'),
                                                    cursor: 'pointer',
                                                    transition: 'all 0.2s',
                                                }}
                                            >
                                                <Icon size={12} style={{ color: isActive || red ? '#d62e2f' : '#9CA3AF', flexShrink: 0 }} />
                                                {label}
                                            </button>
                                        );
                                    })}

                                    <div className="w-px h-5 bg-gray-300 mx-1 self-center" />

                                    {DROPDOWN_LABELS.map((label) => {
                                        const hasSelected = !!selectedFilters[label];
                                        const labelOptions = options[label] || [];
                                        
                                        return (
                                            <div key={label} className="relative inline-block">
                                                <button
                                                    type="button"
                                                    onClick={() => setOpenDropdown(openDropdown === label ? null : label)}
                                                    className={`inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium rounded-full border transition-colors cursor-pointer ${
                                                        hasSelected 
                                                            ? 'bg-red-50 border-red-300 text-red-600 font-bold' 
                                                            : 'bg-white border-gray-300 text-gray-600 hover:text-gray-900 hover:bg-gray-50 hover:border-gray-400'
                                                    }`}
                                                >
                                                    {selectedFilters[label] || label}
                                                    <ChevronDown size={11} className={`transition-transform duration-200 ${openDropdown === label ? 'rotate-180' : ''}`} />
                                                </button>

                                                {openDropdown === label && (
                                                    <div className="absolute left-0 mt-1 w-56 rounded-xl bg-white border border-gray-200 shadow-lg py-2 z-50 max-h-60 overflow-y-auto">
                                                        {labelOptions.length === 0 ? (
                                                            <div className="px-4 py-2 text-xs text-gray-400 italic">No options available</div>
                                                        ) : (
                                                            <>
                                                                {hasSelected && (
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => {
                                                                            setSelectedFilters(prev => ({ ...prev, [label]: null }));
                                                                            setOpenDropdown(null);
                                                                        }}
                                                                        className="w-full text-left px-4 py-2 text-xs text-red-600 font-semibold hover:bg-gray-50 border-b border-gray-100"
                                                                    >
                                                                        Clear Filter
                                                                    </button>
                                                                )}
                                                                {labelOptions.map(option => (
                                                                    <button
                                                                        key={option}
                                                                        type="button"
                                                                        onClick={() => {
                                                                            setSelectedFilters(prev => ({ ...prev, [label]: option }));
                                                                            setOpenDropdown(null);
                                                                        }}
                                                                        className={`w-full text-left px-4 py-2 text-xs hover:bg-gray-50 transition-colors ${
                                                                            selectedFilters[label] === option ? 'text-red-600 font-bold bg-red-50/40' : 'text-gray-700'
                                                                        }`}
                                                                    >
                                                                        {option}
                                                                    </button>
                                                                ))}
                                                            </>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}

                                    <div className="w-px h-5 bg-gray-300 mx-1 self-center" />

                                    <span
                                        style={{
                                            fontSize: '13px',
                                            fontWeight: 600,
                                            color: '#d62e2f',
                                            cursor: 'pointer',
                                        }}
                                        onClick={() => {
                                            setActiveTypeFilter(null);
                                            setSelectedFilters({
                                                'Report Type': null,
                                                'Sector': null,
                                                'Theme': null,
                                                'Region': null,
                                                'Company': null,
                                                'Company Type': null
                                            });
                                        }}
                                    >
                                        Reset
                                    </span>
                                </div>

                                {/* Count */}
                                <p className="text-xs text-gray-500 mb-4">
                                    Showing {filteredResults.length} results
                                </p>

                                {/* Cards */}
                                <div className="border border-gray-200 rounded-xl overflow-hidden divide-y divide-gray-100">
                                    {filteredResults.map((result, idx) => (
                                        <div key={idx} className="p-5 hover:bg-gray-50/60 transition-colors">
                                            <ResearchCard {...result} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </>
                )}

                {!hasSearched && (
                    <div className="flex flex-col items-center justify-center py-20 text-center space-y-3">
                        <Sparkles size={40} className="text-red-200" />
                        <p className="font-medium text-gray-800">Start your research</p>
                        <p className="text-sm text-gray-500 max-w-sm">
                            Enter a search query to get a comprehensive AI summary with relevant insights from Coresight Research.
                        </p>
                    </div>
                )}

                {hasSearched && !isLoading && !summary && !error && (
                    <div className="text-center py-12 text-gray-500 text-sm">
                        No results found. Try a different search query.
                    </div>
                )}
            </div>
        </div>
    );
};
