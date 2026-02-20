<?php
/**
 * Template for the dedicated Coresight Search AI results page.
 *
 * Loaded automatically when visiting /coresight-search?q=...
 * Uses the active theme's header and footer for a seamless look.
 *
 * @package Coresight
 */

get_header();
?>

<main id="coresight-search-page" class="coresight-search-page" style="padding: 2rem 1rem; min-height: 80vh;">
	<div
		data-searchai-root
		data-searchai-display="searchpage"
		class="wp-block-coresight-searchai"
	>
		<!-- Chat interface will be mounted here by view.js -->
		<div style="padding: 1rem; text-align: center; color: #9ca3af;">
			Loading search&hellip;
		</div>
	</div>
</main>

<?php
get_footer();
