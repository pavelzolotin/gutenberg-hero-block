import { useBlockProps, RichText } from '@wordpress/block-editor';
import classnames from 'classnames';

export default function save({ attributes }) {
	const { textAlignment, textColor, title, description, url, alt } = attributes;

	const classes = classnames(`hero-block-align-${textAlignment}`, {
		style: {
			color: textColor,
		},
	});

	return (
		<div
			{...useBlockProps.save({
				className: classes,
			})}
		>
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
