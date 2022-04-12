import heroBg from '../assets/img/machina-hero-bg-pattern.png';
import { useEffect, useState } from '@wordpress/element';
import {
	useBlockProps,
	MediaPlaceholder,
	BlockControls,
	MediaReplaceFlow,
	InspectorControls,
	store as blockEditorStore,
	InnerBlocks,
} from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import { useSelect } from '@wordpress/data';
import { isBlobURL, revokeBlobURL } from '@wordpress/blob';
import {
	Spinner,
	ToolbarButton,
	PanelBody,
	TextareaControl,
	SelectControl,
} from '@wordpress/components';

export default function Edit({ attributes, setAttributes, noticeOperations }) {
	const { url, alt, id } = attributes;
	const [blobURL, setBlobURL] = useState();

	const heroTemplate = [
		['core/heading', { placeholder: __('Title', 'block-test/hero-block') }],
		[
			'core/paragraph',
			{ placeholder: __('Description', 'block-test/hero-block') },
		],
		[
			'core/button',
			{ placeholder: __('Button text', 'block-test/hero-block') },
		],
	];

	const imageObject = useSelect(
		(select) => {
			const { getMedia } = select('core');
			return id ? getMedia(id) : null;
		},
		[id]
	);

	const imageSizes = useSelect((select) => {
		return select(blockEditorStore).getSettings().imageSizes;
	}, []);

	const getImageSizeOptions = () => {
		if (!imageObject) return [];
		const options = [];
		const sizes = imageObject.media_details.sizes;
		for (const key in sizes) {
			const size = sizes[key];
			const imageSize = imageSizes.find((s) => s.slug === key);
			if (imageSize) {
				options.push({
					label: imageSize.name,
					value: size.source_url,
				});
			}
		}
		return options;
	};

	const onChangeAlt = (newAlt) => {
		setAttributes({ alt: newAlt });
	};

	const onSelectImage = (image) => {
		if (!image || !image.url) {
			setAttributes({ url: undefined, id: undefined, alt: '' });
			return;
		}
		setAttributes({ url: image.url, id: image.id, alt: image.alt });
	};

	const onSelectURL = (newURL) => {
		setAttributes({
			url: newURL,
			id: undefined,
			alt: '',
		});
	};

	const onChangeImageSize = (newURL) => {
		setAttributes({ url: newURL });
	};

	const onUploadError = (message) => {
		noticeOperations.removeAllNotices();
		noticeOperations.createErrorNotice(message);
	};

	const removeImage = () => {
		setAttributes({
			url: undefined,
			alt: '',
			id: undefined,
		});
	};

	useEffect(() => {
		if (!id && isBlobURL(url)) {
			setAttributes({
				url: undefined,
				alt: '',
			});
		}
	}, []);

	useEffect(() => {
		if (isBlobURL(url)) {
			setBlobURL(url);
		} else {
			revokeBlobURL(blobURL);
			setBlobURL();
		}
	}, [url]);

	const heroBgPattern = {
		backgroundImage: `url(${heroBg})`,
		backgroundRepeat: 'repeat',
		minHeight: 800 + 'px',
	};

	return (
		<>
			<InspectorControls>
				<PanelBody title={__('Image Settings', 'block-test/hero-block')}>
					{id && (
						<SelectControl
							label={__('Image Size', 'block-test/hero-block')}
							options={getImageSizeOptions()}
							value={url}
							onChange={onChangeImageSize}
						/>
					)}
					{url && !isBlobURL(url) && (
						<TextareaControl
							label={__('Alt Text', 'block-test/hero-block')}
							value={alt}
							onChange={onChangeAlt}
							help={__(
								"Alternative text describes your image to people can't see it. Add a short description with its key details.",
								'block-test/hero-block'
							)}
						/>
					)}
				</PanelBody>
			</InspectorControls>
			{url && (
				<BlockControls group="inline">
					<MediaReplaceFlow
						name={__('Replace File', 'block-test/hero-block')}
						onSelect={onSelectImage}
						onSelectURL={onSelectURL}
						onError={onUploadError}
						accept="image/*, audio/*, video/*"
						allowedTypes={['image', 'audio', 'video']}
						mediaId={id}
						mediaURL={url}
					/>
					<ToolbarButton onClick={removeImage}>
						{__('Remove File', 'block-test/hero-block')}
					</ToolbarButton>
				</BlockControls>
			)}
			<div {...useBlockProps()}>
				<div className="hero">
					<div className="hero-bg">
						<InnerBlocks template={heroTemplate} templateLock="all" />
						{url && (
							<div
								style={heroBgPattern}
								className={`wp-block-block-test-hero-block-img${
									isBlobURL(url) ? ' is-loading' : ''
								}`}
							>
								<img src={url} alt={alt} />
								{isBlobURL(url) && <Spinner />}
							</div>
						)}
						<MediaPlaceholder
							icon="admin-users"
							onSelect={onSelectImage}
							onSelectURL={onSelectURL}
							onError={onUploadError}
							accept="image/*, audio/*, video/*"
							allowedTypes={['image', 'audio', 'video']}
							disableMediaButtons={url}
						/>
					</div>
				</div>
			</div>
		</>
	);
}
