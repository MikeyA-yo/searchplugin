import React from 'react';
import { Lock, KeyRound } from 'lucide-react';

export const ResearchCard = ({
    title,
    summary,
    url,
    date,
    tags,
    category,
    badge,
    image_url
}) => {
    const handleOpenLink = () => {
        if (url) window.open(url, '_blank', 'noopener,noreferrer');
    };

    const hasPremiumBadge = (badge || '').toLowerCase().includes('premium');
    const metaCategory = category || (tags && tags[0]) || 'Research';

    return (
        <div
            onClick={handleOpenLink}
            className="group cursor-pointer"
            style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', gap: '24px', flexWrap: 'nowrap', width: '100%' }}
        >
            {/* Image Column: Using strict inline styles to prevent WordPress CSS from overriding sizes */}
            <div
                className="overflow-hidden rounded-lg bg-gray-100 border border-gray-200 relative"
                style={{ width: '220px', minWidth: '220px', height: '150px', display: 'block', flexShrink: 0 }}
            >
                {image_url ? (
                    <img
                        src={image_url}
                        alt={title || 'Research article'}
                        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                        className="transition-transform duration-300 group-hover:scale-[1.02]"
                        loading="lazy"
                    />
                ) : (
                    <div
                        className="text-gray-400 text-xs font-medium"
                        style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                        No image
                    </div>
                )}
            </div>

            {/* Text Column */}
            <div className="flex-1 min-w-0" style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px', fontSize: '12px', marginBottom: '8px' }}>
                    <span className="font-bold uppercase tracking-widest" style={{ color: '#111827' }}>{metaCategory}</span>
                    {date && <span style={{ color: '#D1D5DB' }}>|</span>}
                    {date && <span style={{ color: '#6B7280', fontWeight: 500 }}>{date}</span>}
                    {badge && (
                        <>
                            <span style={{ color: '#D1D5DB' }}>|</span>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#DC2626', fontWeight: 'bold' }}>
                                {hasPremiumBadge ? <Lock size={12} /> : <KeyRound size={12} />}
                                {badge}
                            </span>
                        </>
                    )}
                </div>

                <h3 
                    className="leading-snug font-bold transition-colors group-hover:text-red-600"
                    style={{ margin: '0 0 12px 0', color: '#111827', fontSize: '20px' }}
                >
                    {title}
                </h3>

                <p 
                    className="leading-relaxed line-clamp-2"
                    style={{ margin: '0 0 16px 0', color: '#374151', fontSize: '15px' }}
                >
                    {summary || 'Click to read the full research report on Coresight.'}
                </p>

                <span 
                    className="font-bold transition-colors group-hover:text-red-600"
                    style={{ display: 'inline-flex', alignItems: 'center', color: '#111827', fontSize: '14px' }}
                >
                    Read More
                </span>
            </div>
        </div>
    );
};
