import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';

export default function save({ attributes }) {
    const { id, url, alt } = attributes;
	return (
		<div {...useBlockProps.save()}>
        {url && (
				<img
					src={url}
					alt={alt}
					className={id ? `wp-image-${id}` : null}
				/>
			)}
			<div className="hero">
				<div className="hero-bg">
					<InnerBlocks.Content />
				</div>
			</div>
		</div>
	);
}
