/**
 * Use this file for JavaScript code that you want to run in the front-end
 * on posts/pages that contain this block.
 */
import { createRoot } from '@wordpress/element';
import { ChatInterface } from './components/ChatInterface';
import { SearchWidget } from './components/SearchWidget';
import './style.scss';

document.addEventListener('DOMContentLoaded', () => {
    // 1. Mount inline block instances (Gutenberg blocks placed in content)
    const blockElements = document.querySelectorAll('[data-searchai-root]');
    blockElements.forEach((element) => {
        if (element.dataset.mounted) return;

        const root = createRoot(element);
        const displayMode = element.dataset.searchaiDisplay || 'inline';

        if (displayMode === 'searchpage') {
            // Dedicated search results page — read query from URL
            const params = new URLSearchParams(window.location.search);
            const initialQuery = params.get('q') || '';
            root.render(<ChatInterface displayMode="inline" initialQuery={initialQuery} />);
        } else {
            root.render(<ChatInterface displayMode={displayMode} />);
        }

        element.dataset.mounted = 'true';
    });

    // 2. Mount floating search widget (injected by wp_footer when global visibility is on)
    const widgetElements = document.querySelectorAll('[data-searchai-widget]');
    widgetElements.forEach((element) => {
        if (element.dataset.mounted) return;
        const root = createRoot(element);
        root.render(<SearchWidget />);
        element.dataset.mounted = 'true';
    });
});
