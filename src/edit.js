import { __ } from '@wordpress/i18n';
import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';
import './editor.scss';

const heroTemplate = [
	['core/heading', { placeholder: __('Title', 'block-test/hero-block') }],
	[
		'core/paragraph',
		{ placeholder: __('Description', 'block-test/hero-block') },
	],
	['core/button', { placeholder: __('Button text', 'block-test/hero-block') }],
];

export default function Edit() {
	return (
		<div {...useBlockProps()}>
			<InnerBlocks template={heroTemplate} templateLock="all" />
		</div>
	);
}
