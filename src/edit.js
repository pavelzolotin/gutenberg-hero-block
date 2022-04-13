import heroBg from "../assets/img/machina-hero-bg-pattern.png";
import { useEffect, useState } from "@wordpress/element";
import {
	useBlockProps,
	MediaPlaceholder,
	BlockControls,
	MediaReplaceFlow,
	InnerBlocks,
} from "@wordpress/block-editor";
import { __ } from "@wordpress/i18n";
import { isBlobURL, revokeBlobURL } from "@wordpress/blob";
import { Spinner, ToolbarButton } from "@wordpress/components";
import "./editor.scss";

export default function Edit({ attributes, setAttributes }) {
	const { url, alt, id } = attributes;
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

	const onSelectImage = (image) => {
		if (!image || !image.url) {
			setAttributes({ url: undefined, id: undefined, alt: "" });
			return;
		}
		setAttributes({ url: image.url, id: image.id, alt: image.alt });
	};

	const onSelectURL = (newURL) => {
		setAttributes({
			url: newURL,
			id: undefined,
			alt: "",
		});
	};

	const removeImage = () => {
		setAttributes({
			url: undefined,
			alt: "",
			id: undefined,
		});
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

	const heroBgPattern = {
		backgroundImage: `url(${heroBg})`,
	};

	return (
		<>
			{url && (
				<BlockControls group="inline">
					<MediaReplaceFlow
						name={__("Replace File", "block-test/hero-block")}
						onSelect={onSelectImage}
						onSelectURL={onSelectURL}
						accept="image/*, video/*"
						allowedTypes={["image", "video"]}
						mediaId={id}
						mediaURL={url}
					/>
					<ToolbarButton onClick={removeImage}>
						{__("Remove File", "block-test/hero-block")}
					</ToolbarButton>
				</BlockControls>
			)}
			<div {...useBlockProps()}>
				{url && <InnerBlocks template={heroTemplate} templateLock="all" />}
				{url && (
					<div
						className={`wp-block-block-test-hero-block__img-wrapper${
							isBlobURL(url) ? " is-loading" : ""
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
					accept="image/*, video/*"
					allowedTypes={["image", "video"]}
					disableMediaButtons={url}
				/>
				{url && (
					<div
						className="wp-block-block-test-hero-block__hero-pattern"
						style={heroBgPattern}
					></div>
				)}
			</div>
		</>
	);
}
