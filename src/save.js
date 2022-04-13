import heroBg from "../assets/img/machina-hero-bg-pattern.png";
import { useBlockProps, InnerBlocks } from "@wordpress/block-editor";

export default function save({ attributes }) {
	const { id, url, alt } = attributes;

	const heroBgPattern = {
		backgroundImage: `url(${heroBg})`,
	};

	return (
		<div {...useBlockProps.save()}>
			<div className="wp-block-block-test-hero-block__inner-blocks">
				<InnerBlocks.Content />
			</div>
			<div className="wp-block-block-test-hero-block-img">
				{url && (
					<img src={url} alt={alt} className={id ? `wp-image-${id}` : null} />
				)}
			</div>
			<div
				className="wp-block-block-test-hero-block__hero-pattern"
				style={heroBgPattern}
			></div>
		</div>
	);
}
