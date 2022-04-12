import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';
import heroBg from '../assets/img/machina-hero-bg-pattern.png';

export default function save({ attributes }) {
	const { url } = attributes;

	const heroSectionStyle = {
		backgroundImage: `url(${url})`,
		backgroundRepeat: ['no-repeat'],
		backgroundSize: 'cover',
		minHeight: 800 + 'px',
	};

	const heroBgPattern = {
		backgroundImage: `url(${heroBg})`,
		backgroundRepeat: 'repeat',
		minHeight: 800 + 'px',
	};

	return (
		<div {...useBlockProps.save()}>
			<div className="hero" style={heroSectionStyle}>
				<div className="hero-bg" style={heroBgPattern}>
					<InnerBlocks.Content />
				</div>
			</div>
		</div>
	);
}
