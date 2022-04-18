import { useEffect, useState } from "@wordpress/element";
import {
	useBlockProps,
	MediaPlaceholder,
	BlockControls,
	MediaReplaceFlow,
	MediaUpload,
	InspectorControls,
	InnerBlocks,
	store as blockEditorStore,
} from "@wordpress/block-editor";
import { __ } from "@wordpress/i18n";
import { useSelect } from "@wordpress/data";
import { isBlobURL, revokeBlobURL } from "@wordpress/blob";
import {
	Spinner,
	withNotices,
	ToolbarButton,
	PanelBody,
	TextareaControl,
	SelectControl,
	Button,
} from "@wordpress/components";
import "./editor.scss";

function Edit({
	attributes,
	setAttributes,
	noticeOperations,
	noticeUI,
	isSelected,
}) {
	const { url, alt, id, typeMedia, posterAlt, posterURL, posterID } =
		attributes;
	const [blobURL, setBlobURL] = useState();

	const heroTemplate = [
		["core/heading", { placeholder: __("Title", "block-test/hero-block") }],
		[
			"core/paragraph",
			{ placeholder: __("Description", "block-test/hero-block") },
		],
		[
			"core/button",
			{ placeholder: __("Button text", "block-test/hero-block") },
		],
	];

	const imageSizes = useSelect((select) => {
		return select(blockEditorStore).getSettings().imageSizes;
	}, []);

	const imageObject = useSelect(
		(select) => {
			const { getMedia } = select("core");
			return id ? getMedia(id) : null;
		},
		[id]
	);

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

	const onSelectPoster = (poster) => {
		setAttributes({
			posterURL: poster.url,
			posterID: poster.id,
			posterAlt: poster.alt,
		});
	};

	const removePoster = () => {
		setAttributes({
			posterURL: undefined,
			posterAlt: "",
			posterID: undefined,
		});
	};

	const onSelectMedia = (media) => {
		if (!media || !media.url) {
			setAttributes({
				url: undefined,
				id: undefined,
				alt: "",
				typeMedia: "",
			});
			return;
		}

		setAttributes({
			url: media.url,
			id: media.id,
			alt: media.alt,
			typeMedia: media.type,
		});
	};

	const onSelectURL = (newURL) => {
		setAttributes({
			url: newURL,
			id: undefined,
			alt: "",
		});
	};

	const removeFile = () => {
		setAttributes({
			url: undefined,
			alt: "",
			id: undefined,
		});
	};

	const onChangeAlt = (newAlt) => {
		setAttributes({ alt: newAlt });
	};

	const onChangeImageSize = (newURL) => {
		setAttributes({ url: newURL });
	};

	const onUploadError = (message) => {
		noticeOperations.removeAllNotices();
		noticeOperations.createErrorNotice(message);
	};

	useEffect(() => {
		if (!id && isBlobURL(url)) {
			setAttributes({
				url: undefined,
				alt: "",
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

	return (
		<>
			<InspectorControls>
				{url && typeMedia === "video" && (
					<PanelBody
						title={__("Select video poster image", "block-test/hero-block")}
						icon="format-image"
						initialOpen={true}
					>
						{posterURL ? (
							<img
								src={posterURL}
								alt={posterAlt}
								className="wp-block-block-test-hero-block__poster-thumbnail"
							/>
						) : (
							<MediaUpload
								onSelect={onSelectPoster}
								accept="image/*"
								allowedTypes={["image"]}
								value={posterID}
								render={({ open }) => (
									<Button
										className="wp-block-block-test-hero-block__btn-poster--select"
										onClick={open}
									>
										Open Library
									</Button>
								)}
							/>
						)}
						{posterURL && isSelected ? (
							<Button
								className="wp-block-block-test-hero-block__btn-poster--remove"
								onClick={removePoster}
							>
								{__("Remove", "block-test/hero-block")}
							</Button>
						) : null}
					</PanelBody>
				)}
				{url && typeMedia === "image" && (
					<PanelBody title={__("Image Settings", "block-test/hero-block")}>
						{id && (
							<SelectControl
								label={__("Image Size", "block-test/hero-block")}
								options={getImageSizeOptions()}
								value={url}
								onChange={onChangeImageSize}
							/>
						)}
						{url && !isBlobURL(url) && (
							<TextareaControl
								label={__("Alt Text", "block-test/hero-block")}
								value={alt}
								onChange={onChangeAlt}
								help={__(
									"Alternative text describes your image to people can't see it. Add a short description with its key details.",
									"block-test/hero-block"
								)}
							/>
						)}
					</PanelBody>
				)}
			</InspectorControls>
			{url && (
				<BlockControls group="inline">
					<MediaReplaceFlow
						name={__("Replace File", "block-test/hero-block")}
						onSelect={onSelectMedia}
						onSelectURL={onSelectURL}
						onError={onUploadError}
						accept="image/*, video/*"
						allowedTypes={["image", "video"]}
						mediaId={id}
						mediaURL={url}
					/>
					<ToolbarButton onClick={removeFile}>
						{__("Remove File", "block-test/hero-block")}
					</ToolbarButton>
				</BlockControls>
			)}
			<div {...useBlockProps()}>
				{url && (
					<div
						className={`wp-block-block-test-hero-block__media-wrapper${
							isBlobURL(url) ? " is-loading" : ""
						}`}
					>
						{typeMedia === "video" ? (
							<video
								src={url}
								className="wp-block-block-test-hero-block__video"
								autoPlay
								loop
								muted
								poster={posterURL}
							/>
						) : (
							<img
								src={url}
								alt={alt}
								className="wp-block-block-test-hero-block__img"
							/>
						)}

						{isBlobURL(url) && <Spinner />}
					</div>
				)}
				<MediaPlaceholder
					icon="admin-users"
					onSelect={onSelectMedia}
					onSelectURL={onSelectURL}
					onError={onUploadError}
					accept="image/*, video/*"
					allowedTypes={["image", "video"]}
					disableMediaButtons={url}
					notices={noticeUI}
				/>
				{url && <InnerBlocks template={heroTemplate} templateLock="all" />}
			</div>
		</>
	);
}

export default withNotices(Edit);
