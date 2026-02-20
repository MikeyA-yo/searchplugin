<?php
/**
 * Plugin Name:       Coresight Search AI
 * Description:       Coresight Search AI block plugin.
 * Version:           0.0.1
 * Requires at least: 6.7
 * Requires PHP:      7.4
 * Author:            EA
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       searchai
 *
 * @package Coresight
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}
/**
 * Registers the block using a `blocks-manifest.php` file, which improves the performance of block type registration.
 * Behind the scenes, it also registers all assets so they can be enqueued
 * through the block editor in the corresponding context.
 *
 * @see https://make.wordpress.org/core/2025/03/13/more-efficient-block-type-registration-in-6-8/
 * @see https://make.wordpress.org/core/2024/10/17/new-block-type-registration-apis-to-improve-performance-in-wordpress-6-7/
 */
function coresight_searchai_block_init() {
	/**
	 * Registers the block(s) metadata from the `blocks-manifest.php` and registers the block type(s)
	 * based on the registered block metadata.
	 * Added in WordPress 6.8 to simplify the block metadata registration process added in WordPress 6.7.
	 *
	 * @see https://make.wordpress.org/core/2025/03/13/more-efficient-block-type-registration-in-6-8/
	 */
	if ( function_exists( 'wp_register_block_types_from_metadata_collection' ) ) {
		wp_register_block_types_from_metadata_collection( __DIR__ . '/build', __DIR__ . '/build/blocks-manifest.php' );
		return;
	}

	/**
	 * Registers the block(s) metadata from the `blocks-manifest.php` file.
	 * Added to WordPress 6.7 to improve the performance of block type registration.
	 *
	 * @see https://make.wordpress.org/core/2024/10/17/new-block-type-registration-apis-to-improve-performance-in-wordpress-6-7/
	 */
	if ( function_exists( 'wp_register_block_metadata_collection' ) ) {
		wp_register_block_metadata_collection( __DIR__ . '/build', __DIR__ . '/build/blocks-manifest.php' );
	}
	/**
	 * Registers the block type(s) in the `blocks-manifest.php` file.
	 *
	 * @see https://developer.wordpress.org/reference/functions/register_block_type/
	 */
	$manifest_data = require __DIR__ . '/build/blocks-manifest.php';
	foreach ( array_keys( $manifest_data ) as $block_type ) {
		register_block_type( __DIR__ . "/build/{$block_type}" );
	}
}
add_action( 'init', 'coresight_searchai_block_init' );

/**
 * Enqueue frontend settings.
 */
function coresight_searchai_frontend_settings() {
	$data = array(
		'apiBaseUrl' => get_option( 'coresight_searchai_api_url', 'https://coresight-chat-backend.vercel.app' ),
	);

	wp_localize_script( 'coresight-searchai-view-script', 'searchaiSettings', $data );

	// Enqueue on global visibility pages
	if ( get_option( 'coresight_searchai_global_visibility' ) ) {
		wp_enqueue_script( 'coresight-searchai-view-script' );

		// Enqueue the view style manually since we are rendering outside the block context
		wp_enqueue_style(
			'coresight-searchai-view-style',
			plugins_url( 'build/searchai/style-view.css', __FILE__ ),
			array(),
			'0.0.1'
		);
	}
}
add_action( 'wp_enqueue_scripts', 'coresight_searchai_frontend_settings' );

/**
 * Register settings page
 */
function coresight_searchai_add_admin_menu() {
	add_options_page(
		'Coresight Search AI',
		'Coresight Search AI',
		'manage_options',
		'coresight_searchai',
		'coresight_searchai_options_page'
	);
}
add_action( 'admin_menu', 'coresight_searchai_add_admin_menu' );

function coresight_searchai_settings_init() {
	register_setting( 'coresightSearchaiPlugin', 'coresight_searchai_global_visibility' );
	register_setting( 'coresightSearchaiPlugin', 'coresight_searchai_api_url', array(
		'type'              => 'string',
		'sanitize_callback' => 'esc_url_raw',
		'default'           => 'https://coresight-chat-backend.vercel.app',
	) );

	add_settings_section(
		'coresight_searchai_plugin_section',
		__( 'Global Display Settings', 'searchai' ),
		'coresight_searchai_settings_section_callback',
		'coresightSearchaiPlugin'
	);

	add_settings_field(
		'coresight_searchai_global_visibility',
		__( 'Show on all pages', 'searchai' ),
		'coresight_searchai_global_visibility_render',
		'coresightSearchaiPlugin',
		'coresight_searchai_plugin_section'
	);

	add_settings_field(
		'coresight_searchai_api_url',
		__( 'Backend URL', 'searchai' ),
		'coresight_searchai_api_url_render',
		'coresightSearchaiPlugin',
		'coresight_searchai_plugin_section'
	);
}
add_action( 'admin_init', 'coresight_searchai_settings_init' );

function coresight_searchai_settings_section_callback() {
	echo __( 'Enable this to show the chat interface on every page of the website.', 'searchai' );
}

function coresight_searchai_global_visibility_render() {
	$options = get_option( 'coresight_searchai_global_visibility' );
	?>
	<input type='checkbox' name='coresight_searchai_global_visibility' <?php checked( $options, 1 ); ?> value='1'>
	<?php
}

function coresight_searchai_api_url_render() {
	$value = get_option( 'coresight_searchai_api_url', 'https://coresight-chat-backend.vercel.app' );
	?>
	<input type='url' name='coresight_searchai_api_url' value='<?php echo esc_attr( $value ); ?>' class='regular-text' placeholder='https://coresight-chat-backend.vercel.app'>
	<p class='description'><?php _e( 'The backend URL for the chat service.', 'searchai' ); ?></p>
	<?php
}

function coresight_searchai_options_page() {
	?>
	<div class="wrap">
		<h1>Coresight Search AI Settings</h1>
		<form action='options.php' method='post'>
			<?php
			settings_fields( 'coresightSearchaiPlugin' );
			do_settings_sections( 'coresightSearchaiPlugin' );
			submit_button();
			?>
		</form>
	</div>
	<?php
}

/**
 * Output root element in footer if enabled
 */
function coresight_searchai_footer_output() {
	if ( get_option( 'coresight_searchai_global_visibility' ) ) {
		echo '<div data-searchai-widget></div>';
	}
}
add_action( 'wp_footer', 'coresight_searchai_footer_output' );

/**
 * Add Settings link to plugin list
 */
function coresight_searchai_plugin_action_links( $links ) {
	$settings_link = '<a href="options-general.php?page=coresight_searchai">' . __( 'Settings', 'searchai' ) . '</a>';
	array_unshift( $links, $settings_link );
	return $links;
}
add_filter( 'plugin_action_links_' . plugin_basename( __FILE__ ), 'coresight_searchai_plugin_action_links' );

