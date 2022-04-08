import { __ } from '@wordpress/i18n';
import {
	useBlockProps,
	RichText,
	BlockControls,
	MediaReplaceFlow,
	MediaPlaceholder,
} from '@wordpress/block-editor';
import { ToolbarButton } from '@wordpress/components';
import './editor.scss';

export default function Edit(props) {
	const { attributes, setAttributes, noticeOperations, noticeUI } = props;
	const { url, alt, id, title, description } = attributes;

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

	return (
		<>
			{url && (
				<BlockControls group="inline">
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
			<div {...useBlockProps()}>
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
