import { __ } from '@wordpress/i18n';
import {
	useBlockProps,
	RichText,
	BlockControls,
	MediaReplaceFlow,
	MediaPlaceholder,
	AlignmentToolbar,
	InspectorControls,
	PanelColorSettings,
} from '@wordpress/block-editor';
import { ToolbarButton } from '@wordpress/components';
import classnames from 'classnames';
import './editor.scss';

export default function Edit(props) {
	const { attributes, setAttributes, noticeOperations, noticeUI } = props;
	const { textAlignment, textColor, url, alt, id, title, description } =
		attributes;

	const onChangeAlignment = (newAlignment) => {
		setAttributes({ textAlignment: newAlignment });
	};

	const classes = classnames(`hero-block-align-${textAlignment}`);

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

	const onChangeTitle = (newTitle) => {
		setAttributes({ title: newTitle });
	};

	const onChangeDescription = (newDescription) => {
		setAttributes({ description: newDescription });
	};

	const onTextColorChange = (newTextColor) => {
		setAttributes({ textColor: newTextColor });
	};

	return (
		<>
			<InspectorControls>
				<PanelColorSettings
					title={__('Color Settings', 'block-test/hero-block')}
					icon="admin-appearance"
					initialOpen
					colorSettings={[
						{
							value: textColor,
							onChange: onTextColorChange,
							label: __('Text Color', 'block-test/hero-block'),
						},
					]}
				/>
			</InspectorControls>
			{url && (
				<BlockControls group="inline">
					<AlignmentToolbar
						value={textAlignment}
						onChange={onChangeAlignment}
					/>
					<MediaReplaceFlow
						name={__('Replace Image', 'block-test/hero-block')}
						onSelect={onSelectImage}
						onSelectURL={onSelectURL}
						onError={onUploadError}
						accept="image/*"
						allowedTypes={['image']}
						mediaId={id}
						mediaURL={url}
					/>
					<ToolbarButton onClick={removeImage}>
						{__('Remove Image', 'block-test/hero-block')}
					</ToolbarButton>
				</BlockControls>
			)}
			<div
				{...useBlockProps({
					className: classes,
					style: {
						color: textColor,
					},
				})}
			>
				{url && (
					<div className={'wp-block-test-hero-block-img'}>
						<img src={url} alt={alt} />
					</div>
				)}
				<MediaPlaceholder
					icon="admin-users"
					onSelect={onSelectImage}
					onSelectURL={onSelectURL}
					onError={onUploadError}
					accept="image/*"
					allowedTypes={['image']}
					disableMediaButtons={url}
					notices={noticeUI}
				/>
				<RichText
					className="hero-block-title"
					onChange={onChangeTitle}
					value={title}
					placeholder={__('Title', 'block-test/hero-block')}
					tagName="h1"
					allowedFormats={[]}
				/>
				<RichText
					className="hero-block-description"
					onChange={onChangeDescription}
					value={description}
					placeholder={__('Description', 'block-test/hero-block')}
					tagName="p"
					allowedFormats={[]}
				/>
				<a href="https://goat.digital" className="hero-btn">
					Learn More
				</a>
			</div>
		</>
	);
}
