import { useBlockProps, InnerBlocks } from "@wordpress/block-editor";

export default function save({ attributes }) {
	const { id, url, alt, typeMedia, posterURL } = attributes;

	return (
		<div {...useBlockProps.save()}>
			{url && (
				<>
					<div className="wp-block-block-test-hero-block__media-wrapper">
						{typeMedia === "video" ? (
							<video
								src={url}
								className={
									id
										? `wp-block-block-test-hero-block__video wp-video-${id}`
										: null
								}
								autoPlay
								loop
								muted
								poster={posterURL}
							/>
						) : (
							<img
								src={url}
								alt={alt}
								className={id ? `wp-image-${id}` : null}
							/>
						)}
					</div>
					<div className="wp-block-block-test-hero-block__inner-blocks">
						<InnerBlocks.Content />
					</div>
				</>
			)}
		</div>
	);
}
