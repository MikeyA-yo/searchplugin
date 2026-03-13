import * as React from "react";
import { Search, X, ArrowRight } from "lucide-react";
import { createRoot } from "@wordpress/element";
import { ChatInterface } from "./ChatInterface";

/**
 * Renders a full screen overlay for search results directly in the DOM.
 */
const SearchOverlay = ({ isOpen, onClose, initialQuery }) => {
	if (!isOpen) return null;

	React.useEffect(() => {
		document.body.style.overflow = "hidden";
		return () => {
			document.body.style.overflow = "";
		};
	}, []);

	return (
		<div className="fixed inset-0 z-[100000] bg-white/95 backdrop-blur-sm animate-in fade-in duration-200 flex flex-col">
			<div className="flex justify-end p-6">
				<button
					onClick={onClose}
					className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-900"
				>
					<X size={32} />
				</button>
			</div>
			<div className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 pb-8 h-full overflow-hidden flex flex-col">
				<ChatInterface displayMode="fullscreen" initialQuery={initialQuery} />
			</div>
		</div>
	);
};

export const SearchWidget = () => {
	const [isOverlayOpen, setIsOverlayOpen] = React.useState(false);
	const [query, setQuery] = React.useState("");

	React.useEffect(() => {
		// Try varying selectors based on common structure, prioritizing the ID provided
		const inputElements = document.querySelectorAll(
			"#search-input, .search-field",
		);

		if (inputElements.length === 0) return;

		const handleSearchAction = (e, inputEl) => {
			e.preventDefault();
			const currentQuery = inputEl.value;
			if (currentQuery.trim()) {
				setQuery(currentQuery);
				setIsOverlayOpen(true);
			}
		};

		const forms = new Set();

		inputElements.forEach((inputElement) => {
			const formElement = inputElement.closest("form");
			if (formElement) {
				forms.add(formElement);
				// We attach to the form submit instead of just the input to catch button clicks too
				formElement.addEventListener("submit", (e) =>
					handleSearchAction(e, inputElement),
				);
			} else {
				// Fallback to Enter key if no form wrapping exists
				inputElement.addEventListener("keydown", (e) => {
					if (e.key === "Enter") handleSearchAction(e, inputElement);
				});
			}
		});

		return () => {
			inputElements.forEach((inputElement) => {
				const formElement = inputElement.closest("form");
				if (formElement) {
					// Since we used an anonymous wrapper for the listener,
					// a cleaner global intercept or keeping track of handlers is better,
					// but for simplicity in unmount (if it ever unmounts), we rely on page reload.
					// However, to be perfectly safe in React:
				}
			});
		};
	}, []);

	// Better event listener cleanup utilizing a ref to store handlers if needed,
	// but a global intercept approach is here:
	React.useEffect(() => {
		const handleSubmit = (e) => {
			const target = e.target;
			if (target && target.tagName === "FORM") {
				const searchInput = target.querySelector(
					"#search-input, .search-field",
				);
				if (searchInput) {
					e.preventDefault();
					const currentQuery = searchInput.value;
					if (currentQuery.trim()) {
						setQuery(currentQuery);
						setIsOverlayOpen(true);
					}
				}
			}
		};

		document.addEventListener("submit", handleSubmit, true); // Use capture phase to intercept early

		return () => {
			document.removeEventListener("submit", handleSubmit, true);
		};
	}, []);

	// Also handle Enter key on the input directly just in case it doesn't trigger standard form submit
	React.useEffect(() => {
		const handleKeyDown = (e) => {
			if (e.key === "Enter") {
				const target = e.target;
				if (
					target &&
					(target.id === "search-input" ||
						target.classList.contains("search-field"))
				) {
					e.preventDefault();
					const currentQuery = target.value;
					if (currentQuery.trim()) {
						setQuery(currentQuery);
						setIsOverlayOpen(true);
					}
				}
			}
		};

		document.addEventListener("keydown", handleKeyDown, true);

		return () => {
			document.removeEventListener("keydown", handleKeyDown, true);
		};
	}, []);

	// Close on Escape key
	React.useEffect(() => {
		const handleEsc = (e) => {
			if (e.key === "Escape") {
				if (isOverlayOpen) setIsOverlayOpen(false);
			}
		};
		document.addEventListener("keydown", handleEsc);
		return () => document.removeEventListener("keydown", handleEsc);
	}, [isOverlayOpen]);

	return (
		<>
			{/* Full Screen Overlay for Results */}
			{isOverlayOpen && (
				<SearchOverlay
					isOpen={isOverlayOpen}
					onClose={() => setIsOverlayOpen(false)}
					initialQuery={query}
				/>
			)}
		</>
	);
};
