import React from 'react';
import { FileText, PlayCircle, LayoutGrid } from 'lucide-react';

export const ResearchCard = ({ title, summary, url, date, tags, category, badge, image_url }) => {
    const handleOpenLink = () => {
        if (url) window.open(url, '_blank', 'noopener,noreferrer');
    };

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
                {/* Meta row: date | badge | icons */}
                <div className="flex flex-wrap items-center gap-2 text-xs mb-2">
                    {date && <span className="text-gray-500 font-medium">{date}</span>}
                    {badge && (
                        <>
                            {date && <span className="text-gray-300">|</span>}
                            <span className="bg-red-600 text-white font-semibold px-2.5 py-0.5 rounded-full text-xs">
                                {badge}
                            </span>
                        </>
                    )}
                    <span className="text-gray-300">|</span>
                    <div className="flex items-center gap-1.5 text-gray-400">
                        <FileText size={12} />
                        <PlayCircle size={12} />
                        <LayoutGrid size={12} />
                    </div>
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
