import * as React from 'react';
import { Sparkles, ArrowRight, Loader } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { ResearchCard } from './ResearchCard';

export const SummaryView = ({ initialQuery = '', displayMode = 'inline' }) => {
    const [query, setQuery] = React.useState(initialQuery);
    const [summary, setSummary] = React.useState(null);
    const [researchResults, setResearchResults] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(false);
    const [error, setError] = React.useState(null);
    const [hasSearched, setHasSearched] = React.useState(false);

    // Read the backend URL injected by WordPress via wp_localize_script in searchai.php
    const apiBaseUrl = (window.searchaiSettings && window.searchaiSettings.apiBaseUrl) || 'https://coresight-chat-backend.vercel.app';

    const handleSearch = async (searchQuery) => {
        if (!searchQuery.trim()) return;

        setIsLoading(true);
        setError(null);
        setSummary(null);
        setResearchResults([]);
        setHasSearched(true);

        try {
            // Enhanced prompt to get comprehensive summary with all relevant links in one response
            const enhancedPrompt = `You are a comprehensive research analyst for Coresight Research. A user is searching for: "${searchQuery}"

Your task is to create a COMPLETE, STANDALONE research summary with:

**Essential Requirements:**
1. Directly and thoroughly answer the search query with all relevant findings
2. Include EVERY relevant statistic, data point, insight, and trend from your knowledge base
3. Embed ALL applicable research report links in markdown format: [Report Title](URL)
4. Provide specific dates, publications, and metrics whenever available
5. Organize content with clear section headers (## for main sections, ### for subsections)
6. Cite specific Coresight Research reports and their findings
7. This is the ONLY response the user will receive - make it comprehensive and complete

**Format Guidelines:**
- Use markdown formatting for emphasis and structure
- Include links naturally within the text where relevant
- Make it professional, concise but thorough
- Focus on actionable insights and key findings

**Quality Standards:**
- No phrases like "I can provide more" or "let me know if you need"
- No follow-up prompts or questions
- Assume this is the final answer the user receives

This must be a FINAL, COMPREHENSIVE research summary. Include all context needed for understanding.`;

            const res = await fetch(`${apiBaseUrl}/search/plugin`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: enhancedPrompt,
                    originalQuery: searchQuery,
                    history: []
                }),
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

    const handleSearchSubmit = async (e) => {
        e.preventDefault();
        await handleSearch(query);
    };

    // Auto-search if initial query is provided
    React.useEffect(() => {
        if (initialQuery && !hasSearched) {
            setQuery(initialQuery);
            handleSearch(initialQuery);
        }
    }, [initialQuery, hasSearched]);

    const summaryEndRef = React.useRef(null);

    React.useEffect(() => {
        summaryEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }, [summary, isLoading]);

    return (
        <div className={`
            flex flex-col bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100
            ${displayMode === 'fullscreen' 
                ? 'max-w-5xl mx-auto w-full h-[calc(100vh-140px)]' 
                : 'h-full'
            }
        `}>
            {/* Top Branding Bar */}
            <div className="bg-red-600 h-1.5 w-full" />

            <div className="flex items-center gap-2 px-6 py-3 border-b border-gray-100 bg-white">
                <div className="bg-red-50 p-1.5 rounded-lg">
                    <Sparkles size={18} className="text-red-600" />
                </div>
                <span className="font-bold text-gray-800 tracking-tight">Coresight Research <span className="text-gray-400 font-normal ml-1">| AI Summary</span></span>
            </div>

            {/* Search Form */}
            <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                <form onSubmit={handleSearchSubmit} className="flex gap-3">
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="What research insights are you looking for?"
                        disabled={isLoading}
                        className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:bg-gray-100 text-gray-900 placeholder-gray-500"
                    />
                    <button
                        type="submit"
                        disabled={isLoading || !query.trim()}
                        className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 disabled:bg-gray-300 transition-colors font-semibold flex items-center gap-2 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <>
                                <Loader size={18} className="animate-spin" />
                                <span>Searching...</span>
                            </>
                        ) : (
                            <>
                                <ArrowRight size={18} />
                                <span>Search</span>
                            </>
                        )}
                    </button>
                </form>
            </div>

            {/* Results Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-gray-50/30">
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700">
                        <p className="font-semibold">Error</p>
                        <p className="text-sm">{error}</p>
                    </div>
                )}

                {isLoading && (
                    <div className="flex flex-col items-center justify-center py-12 space-y-4">
                        <div className="relative w-12 h-12">
                            <div className="absolute inset-0 bg-red-200 rounded-full animate-pulse" />
                            <div className="absolute inset-2 bg-red-100 rounded-full animate-pulse" style={{ animationDelay: '150ms' }} />
                            <Sparkles className="absolute inset-0 m-auto text-red-600 animate-bounce" size={24} />
                        </div>
                        <p className="text-gray-600 font-medium">Searching Coresight Research Library...</p>
                    </div>
                )}

                {hasSearched && !isLoading && summary && (
                    <>
                        {/* Summary Content */}
                        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                            <div className="flex gap-4">
                                <div className="h-10 w-10 min-w-10 rounded-xl bg-red-600 flex items-center justify-center text-white shadow-md shadow-red-200 flex-shrink-0">
                                    <Sparkles size={20} />
                                </div>
                                <div className="flex-1">
                                    <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-3">Research Summary</h2>
                                    <div className="prose prose-sm max-w-none text-gray-700">
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
                                                h1: ({ node, ...props }) => <h1 {...props} className="text-xl font-bold text-gray-900 mt-4 mb-2" />,
                                                h2: ({ node, ...props }) => <h2 {...props} className="text-lg font-bold text-gray-900 mt-3 mb-2" />,
                                                h3: ({ node, ...props }) => <h3 {...props} className="text-base font-bold text-gray-900 mt-2 mb-1" />,
                                                p: ({ node, ...props }) => <p {...props} className="mb-3 text-gray-700 leading-relaxed" />,
                                                ul: ({ node, ...props }) => <ul {...props} className="list-disc list-inside mb-3 text-gray-700" />,
                                                ol: ({ node, ...props }) => <ol {...props} className="list-decimal list-inside mb-3 text-gray-700" />,
                                            }}
                                        >
                                            {summary}
                                        </ReactMarkdown>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Research Cards */}
                        {researchResults && researchResults.length > 0 && (
                            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400">Referenced Resources</h3>
                                    <p className="text-sm font-semibold text-gray-800">Showing {researchResults.length} posts</p>
                                </div>
                                <div className="space-y-6">
                                    {researchResults.map((result, idx) => (
                                        <ResearchCard key={idx} {...result} />
                                    ))}
                                </div>
                            </div>
                        )}
                    </>
                )}

                {hasSearched && !isLoading && !summary && !error && (
                    <div className="text-center py-12 text-gray-500">
                        <p>No results found. Try a different search query.</p>
                    </div>
                )}

                {!hasSearched && (
                    <div className="text-center py-12 space-y-4 text-gray-500">
                        <Sparkles size={48} className="mx-auto text-red-200 opacity-50" />
                        <p className="font-medium">Start your research</p>
                        <p className="text-sm">Enter a search query to get a comprehensive summary with relevant links and insights from Coresight Research.</p>
                    </div>
                )}

                <div ref={summaryEndRef} />
            </div>
        </div>
    );
};
