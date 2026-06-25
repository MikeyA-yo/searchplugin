import React from 'react';
import { FileText, PlayCircle, LayoutGrid, Monitor, Image } from 'lucide-react';

const MULTIMEDIA_ICONS = {
    report:       FileText,
    video:        PlayCircle,
    presentation: Monitor,
    infographic:  LayoutGrid,
    image:        Image,
};

const getIcon = (type) => MULTIMEDIA_ICONS[type] || FileText;

export const ResearchCard = ({ title, summary, url, date, tags, category, badge, image_url, multimedia = [] }) => {
    const handleOpenLink = () => {
        if (url) window.open(url, '_blank', 'noopener,noreferrer');
    };

    const isLoggedIn = window.searchaiSettings?.isLoggedIn || false;
    const isPremiumUser = window.searchaiSettings?.isPremiumUser || false;

    let shouldShowBadge = !!badge;
    if (badge) {
        const badgeLower = badge.toLowerCase();
        if (isPremiumUser && badgeLower.includes('premium')) shouldShowBadge = false;
        if (isLoggedIn && (badgeLower.includes('register') || badgeLower.includes('free access'))) shouldShowBadge = false;
    }

    return (
        <div
            onClick={handleOpenLink}
            className="group cursor-pointer flex gap-5 items-start"
        >
            {/* Thumbnail */}
            <div
                className="overflow-hidden rounded-lg bg-gray-100 border border-gray-100 flex-shrink-0 relative"
                style={{ width: '130px', minWidth: '130px', height: '90px' }}
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

            {/* Text */}
            <div className="flex-1 min-w-0">
                {/* Meta row: date | badge | multimedia icons */}
                <div className="flex flex-wrap items-center gap-2 text-xs mb-2">
                    {date && <span className="text-gray-500 font-medium">{date}</span>}
                    {shouldShowBadge && (
                        <>
                            {date && <span className="text-gray-300">|</span>}
                            <span className="bg-red-600 text-white font-semibold px-2.5 py-0.5 rounded-full text-xs">
                                {badge}
                            </span>
                        </>
                    )}
                    {multimedia.length > 0 && (
                        <>
                            <span className="text-gray-300">|</span>
                            <div className="flex items-center gap-2">
                                {multimedia.map(({ type, label, url: mediaUrl }) => {
                                    const Icon = getIcon(type);
                                    return (
                                        <a
                                            key={type}
                                            href={mediaUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            title={label}
                                            onClick={(e) => e.stopPropagation()}
                                            style={{
                                                color: '#9CA3AF',
                                                display: 'flex',
                                                alignItems: 'center',
                                                textDecoration: 'none',
                                                transition: 'color 0.15s',
                                            }}
                                            onMouseEnter={(e) => (e.currentTarget.style.color = '#d62e2f')}
                                            onMouseLeave={(e) => (e.currentTarget.style.color = '#9CA3AF')}
                                        >
                                            <Icon size={14} />
                                        </a>
                                    );
                                })}
                            </div>
                        </>
                    )}
                </div>

                {/* Title */}
                <h3
                    className="font-bold text-gray-900 leading-snug mb-2 group-hover:text-red-600 transition-colors line-clamp-2"
                    style={{ fontSize: '16px' }}
                >
                    {title}
                </h3>

                {/* Summary */}
                <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">
                    {summary || 'Click to read the full research report on Coresight.'}
                </p>
            </div>
        </div>
    );
};
