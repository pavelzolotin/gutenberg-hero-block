import { useEffect, useState } from "@wordpress/element";
import {
	useBlockProps,
	MediaPlaceholder,
	BlockControls,
	MediaUpload,
	MediaReplaceFlow,
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

function Edit({ attributes, setAttributes, noticeOperations, noticeUI }) {
	const { url, alt, id, typeMedia, posterURL, posterID } = attributes;
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

	const onSelectMedia = (media) => {
		if (!media || !media.url) {
			setAttributes({
				url: undefined,
				id: undefined,
				alt: "",
				typeMedia: "",
				posterID: 0,
				posterURL: "",
			});
			return;
		}

		setAttributes({
			url: media.url,
			id: media.id,
			alt: media.alt,
			typeMedia: media.type,
			posterID: 0,
			posterURL: "",
		});
	};

	const onSelectURL = (newURL) => {
		setAttributes({
			url: newURL,
			id: undefined,
			alt: "",
			typeMedia: "",
		});
	};

	const removeFile = () => {
		setAttributes({
			url: undefined,
			alt: "",
			id: undefined,
			typeMedia: "",
			posterID: 0,
			posterURL: "",
		});
	};

	const onSelectPoster = (media) => {
		if (!media || !media.url) {
			setAttributes({ posterURL: "", posterID: 0 });
			return;
		}
		setAttributes({
			posterURL: media.url,
			posterID: media.id,
		});
	};

	const removePoster = () => {
		setAttributes({
			posterURL: "",
			posterID: 0,
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
				<PanelBody title={__("Image Settings", "block-test/hero-block")}>
					{id && (
						<SelectControl
							label={__("Image Size", "block-test/hero-block")}
							options={getImageSizeOptions()}
							value={url}
							onChange={onChangeImageSize}
						/>
					)}
					{url && !isBlobURL(url) && typeMedia === "image" && (
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
					{url && typeMedia === "video" && (
						<>
							<MediaUpload
								onSelect={onSelectPoster}
								allowedTypes={["image"]}
								value={posterID}
								render={({ open }) => (
									<Button
										className={
											posterID === 0
												? "wp-block-block-test-hero-block__btn-poster--select editor-post-featured-image__toggle"
												: "editor-post-featured-image__preview"
										}
										onClick={open}
									>
										{posterID === 0 &&
											__("Select poster image", "block-test/hero-block")}
										{posterURL !== undefined && <img alt="" src={posterURL} />}
									</Button>
								)}
							/>
							{posterID !== 0 && (
								<Button onClick={removePoster} isDestructive>
									{__(
										"Remove poster image",
										"wp-block-block-test-hero-block__btn-poster--remove block-test/hero-block"
									)}
								</Button>
							)}
						</>
					)}
				</PanelBody>
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
				{url && (
					<div className="wp-block-block-test-hero-block__inner-blocks">
						<InnerBlocks template={heroTemplate} templateLock="all" />
					</div>
				)}
			</div>
		</>
	);
}

export default withNotices(Edit);
