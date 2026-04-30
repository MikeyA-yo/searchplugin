import * as React from "react";
import { X } from "lucide-react";
import { createRoot } from "@wordpress/element";
import { SummaryView } from "./SummaryView";
import CleanModal from "./CleanModal";

/**
 * Renders a full screen overlay for search results directly in the DOM.
 */
const SearchOverlay = ({ isOpen, onClose, initialQuery }) => {
	return (
		<CleanModal isOpen={isOpen} onClose={onClose}>
			<SummaryView displayMode="fullscreen" initialQuery={initialQuery} />
		</CleanModal>
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
