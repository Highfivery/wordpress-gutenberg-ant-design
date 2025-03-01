/**
 * Import react dependencies
 */
import { useState } from "react";

/**
 * Import @wordpress dependencies
 */
import { __ } from "@wordpress/i18n";
import {
	useBlockProps,
	InspectorControls,
	MediaPlaceholder,
	BlockIcon,
} from "@wordpress/block-editor";
import { PanelBody } from "@wordpress/components";
import { image as icon } from "@wordpress/icons";

/**
 * Import andt components, dependencies & configuration
 */
import { Image as AntImage, theme } from "antd";
import {
	updateAttributes,
	createDefaultAttributes,
	generateStyles,
} from "../../shared";
import { BlockVisibility } from "../../block-editor/block-visibility";
import { BlockStyles } from "../../block-editor/block-styles";
import { ImageControls } from "../../shared/controls";
import { BlockScreenSizeButtonGroup } from "../../block-editor/block-screen-size-button-group";

/**
 * Import editor styles
 */
import "./editor.scss";

// Define the component's default attributes
const defaultAttributes = createDefaultAttributes({
	api: {
		alt: undefined,
		height: undefined,
		placeholder: undefined,
		preview: false,
		src: undefined,
		width: undefined,
	},
	settings: {
		image: undefined,
	},
});
/**
 * Gutenberg Edit component
 */
export default function Image({ attributes, setAttributes, clientId }) {

	const { useToken } = theme;
	const { token } = useToken();

	// Used by the Gutenberg editor to save & output blocks properly
	const blockProps = useBlockProps({
		className: `gutenberg-ant-design--${clientId}`,
	});

	// Merge the default attributes with the saved ones
	const savedAttributes = { ...defaultAttributes, ...attributes };

	// Component states
	const [activeScreenSize, setActiveScreenSize] = useState("xs");

	// Component processing
	const { placeholder } = savedAttributes.api;
	const width = savedAttributes.api.width
		? savedAttributes.api.width
		: savedAttributes.settings.image?.width;
	const height = savedAttributes.api.height
		? savedAttributes.api.height
		: savedAttributes.settings.image?.height;
	const alt = savedAttributes.api.alt
		? savedAttributes.api.alt
		: savedAttributes.settings.image?.alt;
	const src = savedAttributes.settings.image?.url;

	// Component helpers
	const onSelectImage = (media) => {
		updateAttributes(
			"settings",
			"image",
			media,
			savedAttributes,
			setAttributes
		);
	};

	/**
	 * Ant Design component props
	 *
	 * These should match the available API properties and their default for the
	 * corresponding Ant Design component. Note: Some props like that accept
	 * functions or more dynamic values like functions of ReactNodes may need to
	 * be omitted or parsed.
	 */
	const antdComponentProps = {
		alt,
		placeholder,
		// Prevent preview in editor to allow for editing on click
		preview: false,
		src,
	};

	return (
		<>
			<div {...blockProps}>
				{src && <AntImage {...antdComponentProps} />}
				<style>
					{generateStyles(savedAttributes, clientId, token, undefined, ".ant-image")}
				</style>

				{!src && (
					<MediaPlaceholder
						allowedTypes={["image"]}
						accept="image/*"
						icon={<BlockIcon icon={icon} />}
						onSelect={onSelectImage}
						value={savedAttributes.settings.image}
					/>
				)}
			</div>

			<InspectorControls>
				<BlockVisibility
					attributes={savedAttributes}
					setAttributes={setAttributes}
				/>

				<PanelBody title={__("Options")} initialOpen={false}>
					<BlockScreenSizeButtonGroup
						onChange={(value) => {
							setActiveScreenSize(value);
						}}
						selected={activeScreenSize}
					/>
				</PanelBody>

				<ImageControls
					updateAttributes={updateAttributes}
					savedAttributes={savedAttributes}
					setAttributes={setAttributes}
				/>
				<BlockStyles
					styles={savedAttributes.styles}
					onChange={(screenSize, attribute, value) => {
						updateAttributes(
							"styles",
							screenSize,
							{
								...savedAttributes.styles[screenSize],
								[attribute]: value,
							},
							savedAttributes,
							setAttributes
						);
					}}
					enabledScreenSizes={savedAttributes.visibility}
				/>
			</InspectorControls>
		</>
	);
}
