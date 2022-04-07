import { __ } from '@wordpress/i18n';
import { useBlockProps } from '@wordpress/block-editor';
import './editor.scss';

export default function Edit() {
	return (
		<p {...useBlockProps()}>
			{__('Hero block – hello from the hero block!', 'block-test/hero-block')}
		</p>
	);
}
