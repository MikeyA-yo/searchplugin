import React from 'react';
import { ArrowUpRight } from 'lucide-react';

export const ResearchCard = ({ title, summary, url, date, tags }) => {
    const handleOpenLink = () => {
        if (url) window.open(url, '_blank', 'noopener,noreferrer');
    };

    return (
        <div
            onClick={handleOpenLink}
            className="group relative bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-all duration-300 hover:border-red-500 cursor-pointer flex flex-col h-full"
        >
            <div className="flex justify-between items-start mb-3">
                <span className="text-[10px] font-bold uppercase tracking-widest text-red-600 bg-red-50 px-2 py-1 rounded">
                    Coresight Research
                </span>
                {date && <span className="text-xs text-gray-400">{date}</span>}
            </div>

            <h3 className="text-md font-bold text-gray-900 mb-2 group-hover:text-red-600 transition-colors line-clamp-2">
                {title}
            </h3>

            <p className="text-xs text-gray-600 mb-4 line-clamp-3 flex-1">
                {summary || "Click to read the full research report on Coresight."}
            </p>

            <div className="flex items-center justify-between mt-auto pt-4">
                <div className="flex flex-wrap gap-1.5">
                    {tags && tags.length > 0 ? (
                        tags.map((tag) => (
                            <span key={tag} className="text-[10px] text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                                {tag}
                            </span>
                        ))
                    ) : (
                        <span className="text-[10px] text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full italic">
                            Retail Insight
                        </span>
                    )}
                </div>
                <div className="p-1.5 rounded-full text-gray-400 group-hover:text-red-600 group-hover:bg-red-50 transition-all">
                    <ArrowUpRight size={18} />
                </div>
            </div>
        </div>
    );
};
