import * as React from 'react';
import { Search, Sparkles, ChevronDown, ChevronUp, X, FileText, PlayCircle, Mic, LayoutGrid } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { ResearchCard } from './ResearchCard';

const M = 'Montserrat, sans-serif';
const R = 'Roboto, sans-serif';
const C = {
    red:     '#D62E2F',
    text:    '#2D2A29',
    muted:   '#888888',
    mid:     '#4F4F4F',
    border:  '#CBCACA',
    surface: '#FFFFFF',
    mute:    '#F2F2F2',
    bg:      '#F9F9F9',
};

const TYPE_FILTERS = [
    { label: 'Reports',    icon: FileText,   href: 'https://coresight.com/research/?fwp_research_products=deep-dives%2Cinsight-reports', red: true  },
    { label: 'Video',      icon: PlayCircle, href: 'https://coresight.com/coresight-research-videos/',                                   red: true  },
    { label: 'Podcast',    icon: Mic,        href: 'https://coresight.com/retailistic-podcast/',                                          red: false },
    { label: 'Infographic',icon: LayoutGrid, href: 'https://coresight.com/industry-events',                                               red: false },
];

const DROPDOWNS = ['Report Type', 'Sector', 'Theme', 'Region', 'Company', 'Company Type'];

export const SummaryView = ({ initialQuery = '' }) => {
    const [query,             setQuery]             = React.useState(initialQuery);
    const [inputValue,        setInputValue]        = React.useState(initialQuery);
    const [summary,           setSummary]           = React.useState(null);
    const [researchResults,   setResearchResults]   = React.useState([]);
    const [isLoading,         setIsLoading]         = React.useState(false);
    const [error,             setError]             = React.useState(null);
    const [hasSearched,       setHasSearched]       = React.useState(false);
    const [isSummaryExpanded, setIsSummaryExpanded] = React.useState(false);

    const apiBaseUrl = (window.searchaiSettings && window.searchaiSettings.apiBaseUrl)
        || 'https://coresight-chat-backend.vercel.app';

    const handleSearch = async (q) => {
        if (!q.trim()) return;
        setIsLoading(true); setError(null); setSummary(null);
        setResearchResults([]); setHasSearched(true); setIsSummaryExpanded(false);
        try {
            const res = await fetch(`${apiBaseUrl}/search/plugin`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: q, history: [] }),
            });
            if (!res.ok) {
                const e = await res.json().catch(() => ({}));
                throw new Error(e.details || `Request failed: ${res.status}`);
            }
            const data = await res.json();
            const articles = Array.isArray(data.articles)
                ? data.articles.map((a) => ({
                    title: a.title, url: a.url, summary: a.summary,
                    date: a.date, tags: a.tags, category: a.category,
                    badge: a.badge, image_url: a.image_url || a.imageUrl || '',
                    formats: a.formats || [], multimedia: a.multimedia || [],
                }))
                : [];
            setSummary(data.response ?? 'No summary available');
            setResearchResults(articles);
        } catch (err) {
            setError(`Connection Error: ${err.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (inputValue.trim()) { setQuery(inputValue); handleSearch(inputValue); }
    };

    React.useEffect(() => {
        if (initialQuery && !hasSearched) {
            setInputValue(initialQuery); setQuery(initialQuery); handleSearch(initialQuery);
        }
    }, [initialQuery]);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: C.bg, overflow: 'hidden' }}>

            {/* ── Search bar ── */}
            <div style={{
                background: C.surface, borderBottom: `1px solid ${C.mute}`,
                padding: '19px 48px', flexShrink: 0,
            }}>
                <form onSubmit={handleSubmit} style={{
                    position: 'relative', display: 'flex', alignItems: 'center', gap: '8px',
                    background: C.surface, border: `1px solid ${C.border}`,
                    borderRadius: '16px', padding: '8px 16px', maxWidth: '1224px',
                }}>
                    <Search size={20} style={{ color: C.muted, flexShrink: 0 }} />
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Search All Research"
                        disabled={isLoading}
                        style={{
                            flex: 1, border: 'none', outline: 'none', background: 'none',
                            fontFamily: M, fontWeight: 600, fontSize: '16px',
                            lineHeight: '22px', color: C.text,
                        }}
                    />
                    {inputValue && (
                        <button
                            type="button"
                            onClick={() => setInputValue('')}
                            style={{
                                width: '20px', height: '20px', borderRadius: '50%',
                                background: '#4F4F4F', border: 'none', cursor: 'pointer',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                padding: 0, flexShrink: 0,
                            }}
                        >
                            <X size={10} style={{ color: '#FFFFFF' }} />
                        </button>
                    )}
                </form>
            </div>

            {/* ── Scrollable content ── */}
            <div style={{ flex: 1, overflowY: 'auto', background: C.bg }}>

                {/* Error */}
                {error && (
                    <div style={{ margin: '22px 48px', padding: '16px', background: '#FEE2E2', border: '1px solid #FECACA', borderRadius: '16px' }}>
                        <p style={{ fontFamily: M, fontWeight: 700, fontSize: '14px', color: '#DC2626', marginBottom: '4px' }}>Error</p>
                        <p style={{ fontFamily: R, fontSize: '14px', color: '#DC2626' }}>{error}</p>
                    </div>
                )}

                {/* Loading */}
                {isLoading && (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '80px 48px', gap: '16px' }}>
                        <div style={{ position: 'relative', width: '48px', height: '48px' }}>
                            <div style={{ position: 'absolute', inset: 0, background: '#FECACA', borderRadius: '50%' }} />
                            <div style={{ position: 'absolute', inset: '8px', background: '#FEE2E2', borderRadius: '50%' }} />
                            <Sparkles style={{ position: 'absolute', inset: 0, margin: 'auto', color: C.red }} size={20} />
                        </div>
                        <p style={{ fontFamily: R, fontSize: '16px', color: C.muted }}>Searching Coresight Research Library…</p>
                    </div>
                )}

                {/* ── AI Overview card ── */}
                {hasSearched && !isLoading && summary && (
                    <div style={{ padding: '22px 48px 0' }}>
                        <div style={{
                            background: C.surface, border: `1px solid ${C.border}`,
                            borderRadius: '16px', padding: '16px',
                            display: 'flex', flexDirection: 'column', gap: '16px',
                            maxWidth: '1224px',
                        }}>
                            {/* Title */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Sparkles size={20} style={{ color: C.red, flexShrink: 0 }} />
                                <span style={{ fontFamily: M, fontWeight: 700, fontSize: '16px', lineHeight: '20px', letterSpacing: '-0.5px', color: C.text }}>
                                    AI Overview
                                </span>
                            </div>

                            {/* Body */}
                            <div style={{
                                fontFamily: R, fontSize: '16px', lineHeight: '150%', color: C.text,
                                overflow: 'hidden',
                                display: '-webkit-box', WebkitBoxOrient: 'vertical',
                                WebkitLineClamp: isSummaryExpanded ? 'unset' : 3,
                            }}>
                                <ReactMarkdown
                                    components={{
                                        a: ({ node, ...props }) => (
                                            <a {...props} style={{ color: C.red, textDecoration: 'underline' }} target="_blank" rel="noopener noreferrer" />
                                        ),
                                        p: ({ node, ...props }) => (
                                            <p {...props} style={{ margin: '0 0 8px', fontFamily: R, fontSize: '16px', color: C.text, lineHeight: '150%' }} />
                                        ),
                                    }}
                                >
                                    {summary}
                                </ReactMarkdown>
                            </div>

                            {/* Show more row with flanking lines */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                <div style={{ flex: 1, height: '1px', background: C.border }} />
                                <button
                                    onClick={() => setIsSummaryExpanded(!isSummaryExpanded)}
                                    style={{
                                        display: 'inline-flex', alignItems: 'center', gap: '8px',
                                        background: C.mute, border: `1px solid ${C.border}`,
                                        borderRadius: '25px', padding: '4px 12px',
                                        cursor: 'pointer', whiteSpace: 'nowrap',
                                    }}
                                >
                                    <span style={{ fontFamily: R, fontSize: '16px', lineHeight: '19px', color: C.red }}>
                                        {isSummaryExpanded ? 'Show less' : 'Show more'}
                                    </span>
                                    {isSummaryExpanded
                                        ? <ChevronUp  size={14} style={{ color: C.red }} />
                                        : <ChevronDown size={14} style={{ color: C.red }} />
                                    }
                                </button>
                                <div style={{ flex: 1, height: '1px', background: C.border }} />
                            </div>
                        </div>
                    </div>
                )}

                {/* ── Results feed ── */}
                {hasSearched && !isLoading && researchResults.length > 0 && (
                    <div style={{ padding: '24px 48px' }}>
                        <div style={{
                            background: C.surface, border: `1px solid ${C.border}`,
                            borderRadius: '16px', padding: '16px',
                            display: 'flex', flexDirection: 'column', gap: '16px',
                            maxWidth: '1224px',
                        }}>
                            {/* Feed header */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                {/* Title row */}
                                <span style={{ fontFamily: M, fontWeight: 700, fontSize: '16px', lineHeight: '20px', letterSpacing: '-0.5px', color: C.text }}>
                                    All results matching &ldquo;{query}&rdquo;
                                </span>

                                {/* Filter row */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                                    {/* Type pills */}
                                    {TYPE_FILTERS.map(({ label, icon: Icon, href, red }) => (
                                        <a
                                            key={label}
                                            href={href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            style={{
                                                display: 'inline-flex', alignItems: 'center', gap: '4px',
                                                background: red ? C.mute : C.surface,
                                                border: `1px solid ${C.border}`,
                                                borderRadius: '25px', padding: '4px 12px',
                                                textDecoration: 'none', cursor: 'pointer',
                                            }}
                                        >
                                            <Icon size={14} style={{ color: red ? C.red : C.mid, flexShrink: 0 }} />
                                            <span style={{ fontFamily: R, fontSize: '16px', lineHeight: '19px', color: red ? C.red : C.mid }}>
                                                {label}
                                            </span>
                                        </a>
                                    ))}

                                    {/* Divider */}
                                    <div style={{ width: '1px', height: '24px', background: C.border }} />

                                    {/* Dropdown filters */}
                                    {DROPDOWNS.map((label) => (
                                        <button
                                            key={label}
                                            style={{
                                                display: 'inline-flex', alignItems: 'center', gap: '6px',
                                                background: 'none', border: 'none', cursor: 'pointer', padding: 0, margin: 0,
                                            }}
                                        >
                                            <span style={{ fontFamily: R, fontSize: '16px', lineHeight: '19px', color: C.mid }}>
                                                {label}
                                            </span>
                                            <ChevronDown size={12} style={{ color: C.mid }} />
                                        </button>
                                    ))}

                                    {/* Divider + Reset */}
                                    <div style={{ width: '1px', height: '24px', background: C.border }} />
                                    <span style={{ fontFamily: R, fontSize: '16px', lineHeight: '19px', color: C.red, cursor: 'pointer' }}>
                                        Reset
                                    </span>
                                </div>

                                {/* Count */}
                                <span style={{ fontFamily: R, fontSize: '16px', lineHeight: '19px', color: C.muted }}>
                                    Showing {researchResults.length} results
                                </span>
                            </div>

                            {/* Cards */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
                                {researchResults.map((result, idx) => (
                                    <ResearchCard key={idx} {...result} />
                                ))}
                            </div>

                            {/* View All */}
                            <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '8px' }}>
                                <a
                                    href={`https://coresight.com/?s=${encodeURIComponent(query)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                        display: 'inline-flex', alignItems: 'center', gap: '8px',
                                        background: C.mute, border: `1px solid ${C.border}`,
                                        borderRadius: '25px', padding: '4px 20px',
                                        textDecoration: 'none',
                                    }}
                                >
                                    <span style={{ fontFamily: R, fontSize: '16px', lineHeight: '19px', color: C.red }}>View All</span>
                                    <ChevronDown size={14} style={{ color: C.red, transform: 'rotate(-90deg)' }} />
                                </a>
                            </div>
                        </div>
                    </div>
                )}

                {/* Empty state */}
                {!hasSearched && (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 48px', gap: '12px', textAlign: 'center' }}>
                        <Sparkles size={40} style={{ color: C.border }} />
                        <p style={{ fontFamily: M, fontWeight: 700, fontSize: '16px', color: C.text }}>Start your research</p>
                        <p style={{ fontFamily: R, fontSize: '16px', color: C.muted, maxWidth: '480px' }}>
                            Enter a search query to get a comprehensive AI summary with relevant insights from Coresight Research.
                        </p>
                    </div>
                )}

                {hasSearched && !isLoading && !summary && !error && (
                    <div style={{ textAlign: 'center', padding: '80px 48px' }}>
                        <p style={{ fontFamily: R, fontSize: '16px', color: C.muted }}>No results found. Try a different search query.</p>
                    </div>
                )}

            </div>
        </div>
    );
};
