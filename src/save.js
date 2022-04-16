import heroBg from "../assets/img/machina-hero-bg-pattern.png";
import { useBlockProps, InnerBlocks } from "@wordpress/block-editor";

export default function save({ attributes }) {
	const { id, url, alt, typeMedia, posterURL, posterAlt } = attributes;

	const heroBgPattern = {
		backgroundImage: `url(${heroBg})`,
	};

	return (
		<div {...useBlockProps.save()}>
			<div className="wp-block-block-test-hero-block__media-wrapper">
				{typeMedia === "video" ? (
					<video
						src={url}
						className={id ? `wp-video-${id}` : null}
						autoPlay
						loop
						muted
						poster={posterURL}
					/>
				) : (
					<img src={url} alt={alt} className={id ? `wp-image-${id}` : null} />
				)}
			</div>
			<div
				className="wp-block-block-test-hero-block__hero-pattern"
				style={heroBgPattern}
			/>
			<div className="wp-block-block-test-hero-block__inner-blocks">
				<InnerBlocks.Content />
			</div>
			{typeMedia === "video" ? (
				<img
					src={posterURL}
					alt={posterAlt}
					className="wp-block-block-test-hero-block__poster-thumbnail"
				/>
			) : null}
		</div>
	);
}
