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
        >
            <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-6 lg:gap-8 items-start">
                <div className="relative overflow-hidden rounded-lg bg-gray-100 border border-gray-200 aspect-[4/3]">
                    {image_url ? (
                        <img
                            src={image_url}
                            alt={title || 'Research article'}
                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                            loading="lazy"
                        />
                    ) : (
                        <div className="h-full w-full flex items-center justify-center text-gray-400 text-sm font-medium">
                            No image available
                        </div>
                    )}
                </div>

                <div className="pt-1">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px] mb-3">
                        <span className="font-semibold uppercase tracking-wide text-gray-800">{metaCategory}</span>
                        {date && <span className="text-gray-400">|</span>}
                        {date && <span className="text-gray-700">{date}</span>}
                        {badge && (
                            <>
                                <span className="text-gray-400">|</span>
                                <span className="inline-flex items-center gap-1.5 text-red-600 font-medium">
                                    {hasPremiumBadge ? <Lock size={14} /> : <KeyRound size={14} />}
                                    {badge}
                                </span>
                            </>
                        )}
                    </div>

                    <h3 className="text-2xl md:text-4xl leading-tight font-bold text-gray-900 mb-4 group-hover:text-red-600 transition-colors line-clamp-3">
                        {title}
                    </h3>

                    <p className="text-base md:text-[20px] md:leading-9 text-gray-800 mb-6 line-clamp-4">
                        {summary || 'Click to read the full research report on Coresight.'}
                    </p>

                    <span className="inline-flex items-center text-2xl md:text-[40px] leading-none font-bold text-gray-900 group-hover:text-red-600 transition-colors">
                        Read More
                    </span>
                </div>
            </div>
        </div>
    );
};
