import { __ } from '@wordpress/i18n';
import { useBlockProps } from '@wordpress/block-editor';

export default function save() {
	return (
		<p {...useBlockProps.save()}>
			{__(
				'Hero block – hello from the saved content!',
				'block-test/hero-block'
			)}
		</p>
	);
}
