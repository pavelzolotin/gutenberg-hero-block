import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';
import './editor.scss';

const heroTemplate = [
	['core/image', {}],
	['core/heading', { placeholder: 'Title' }],
	['core/paragraph', { placeholder: 'Description' }],
	['core/button', { placeholder: 'Some text' }],
	['core/video', { placeholder: 'Add video' }],
	['core/audio', { placeholder: 'Add audio' }],
];

export default function Edit() {
	return (
		<div {...useBlockProps.save()}>
			<InnerBlocks template={heroTemplate} templateLock="all" />
		</div>
	);
}
