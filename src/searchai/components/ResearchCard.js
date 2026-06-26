import React from 'react';
import { FileText, PlayCircle, LayoutGrid, Monitor } from 'lucide-react';

const M = 'Montserrat, sans-serif';
const R = 'Roboto, sans-serif';

const ICON_MAP = {
    report:       FileText,
    video:        PlayCircle,
    presentation: Monitor,
    infographic:  LayoutGrid,
};

const getIcon = (type) => ICON_MAP[type] || FileText;

export const ResearchCard = ({ title, summary, url, date, badge, image_url, multimedia = [] }) => {
    const handleOpenLink = () => {
        if (url) window.open(url, '_blank', 'noopener,noreferrer');
    };

    const isLoggedIn    = window.searchaiSettings?.isLoggedIn    || false;
    const isPremiumUser = window.searchaiSettings?.isPremiumUser || false;

    let shouldShowBadge = !!badge;
    if (badge) {
        const bl = badge.toLowerCase();
        if (isPremiumUser && bl.includes('premium')) shouldShowBadge = false;
        if (isLoggedIn && (bl.includes('register') || bl.includes('free access'))) shouldShowBadge = false;
    }

    return (
        <div
            onClick={handleOpenLink}
            style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', gap: '35px', cursor: 'pointer', width: '100%' }}
        >
            {/* Cover image */}
            <div style={{
                width: '220px', minWidth: '220px', height: '148px',
                borderRadius: '8px', overflow: 'hidden',
                background: '#F2F2F2', position: 'relative', flexShrink: 0,
            }}>
                {image_url ? (
                    <img
                        src={image_url}
                        alt={title || 'Research article'}
                        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                        loading="lazy"
                    />
                ) : (
                    <div style={{
                        position: 'absolute', inset: 0, display: 'flex',
                        alignItems: 'center', justifyContent: 'center',
                        color: '#888888', fontSize: '12px', fontFamily: R,
                    }}>
                        No image
                    </div>
                )}
            </div>

            {/* Report info */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px', minWidth: 0 }}>

                {/* Date | badge | multimedia icons */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                    {date && (
                        <span style={{ fontFamily: R, fontWeight: 600, fontSize: '16px', lineHeight: '19px', color: '#888888' }}>
                            {date}
                        </span>
                    )}

                    {shouldShowBadge && (
                        <>
                            <div style={{ width: '1px', height: '16px', background: '#CBCACA' }} />
                            <span style={{
                                background: '#F2F2F2', borderRadius: '25px', padding: '4px 12px',
                                fontFamily: R, fontWeight: 600, fontSize: '16px', lineHeight: '19px',
                                color: '#D62E2F', whiteSpace: 'nowrap',
                            }}>
                                {badge}
                            </span>
                        </>
                    )}

                    {multimedia.length > 0 && (
                        <>
                            <div style={{ width: '1px', height: '16px', background: '#CBCACA' }} />
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
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
                                                width: '40px', height: '24px',
                                                background: '#F2F2F2', borderRadius: '25px',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                textDecoration: 'none', color: '#4F4F4F', flexShrink: 0,
                                            }}
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
                <h3 style={{
                    fontFamily: M, fontWeight: 700, fontSize: '20px',
                    lineHeight: '24px', letterSpacing: '0.25px', color: '#2D2A29',
                    margin: 0, display: '-webkit-box',
                    WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
                }}>
                    {title}
                </h3>

                {/* Summary */}
                <p style={{
                    fontFamily: R, fontWeight: 400, fontSize: '16px', lineHeight: '19px',
                    color: '#888888', margin: 0,
                    display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
                }}>
                    {summary || 'Click to read the full research report on Coresight.'}
                </p>

            </div>
        </div>
    );
};
