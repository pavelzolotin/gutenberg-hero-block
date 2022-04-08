import { useBlockProps, RichText } from '@wordpress/block-editor';

export default function save({ attributes }) {
	const { title, description, url, alt } = attributes;

	return (
		<div {...useBlockProps.save()}>
			<div className={'wp-block-test-hero-block-img'}>
				<img src={url} alt={alt} />
			</div>
			<RichText.Content tagName="h1" value={title} />
			<RichText.Content tagName="p" value={description} />
			<a href="https://goat.digital" className="hero-btn">
				Learn More
			</a>
		</div>
	);
}
