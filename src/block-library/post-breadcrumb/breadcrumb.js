/**
 * Import @wordpress dependencies
 */
import { __ } from "@wordpress/i18n";
import { useBlockProps, InspectorControls } from "@wordpress/block-editor";

import { PanelBody } from "@wordpress/components";
import { useEntityRecord } from "@wordpress/core-data";

/**
 * Import andt components, dependencies & configuration
 */
import { Breadcrumb as AntBreadcrumb, theme } from "antd";
import {
	updateAttributes,
	createDefaultAttributes,
	generateStyles,
} from "../../shared";
import { BlockVisibility } from "../../block-editor/block-visibility";

/**
 * Import editor styles
 */
import "./editor.scss";

// Define the component's default attributes
const defaultAttributes = createDefaultAttributes({
	api: {
		separator: "/",
	},
});

/**
 * Gutenberg Edit component
 * @TODO: Make more dynamic to hanlde child pages, archives & taxonomies
 */
export default function Breadcrumb({
	attributes,
	setAttributes,
	clientId,
	context: { postType, postId, queryId },
}) {
	const { useToken } = theme;
	const { token } = useToken();

	const { record, isResolving } = useEntityRecord("postType", postType, postId);
	// Used by the Gutenberg editor to save & output blocks properly
	const blockProps = useBlockProps({
		className: `gutenberg-ant-design--${clientId}`,
	});

	// Merge the default attributes with the saved ones
	const savedAttributes = { ...defaultAttributes, ...attributes };

	// Component states

	// Component processing
	const { separator } = savedAttributes.api;

	/**
	 * Ant Design component props
	 *
	 * These should match the available API properties and their default for the
	 * corresponding Ant Design component. Note: Some props like that accept
	 * functions or more dynamic values like functions of ReactNodes may need to
	 * be omitted or parsed.
	 */
	const antdComponentProps = {
		separator,
	};

	return (
		<>
			<AntBreadcrumb {...blockProps} {...antdComponentProps}>
				<AntBreadcrumb.Item>
					<a href="#">Home</a>
				</AntBreadcrumb.Item>
				<AntBreadcrumb.Item>
					<a href="#">{record.title.raw}</a>
				</AntBreadcrumb.Item>
			</AntBreadcrumb>
			<style>{generateStyles(savedAttributes, clientId, token)}</style>

			<InspectorControls>
				<BlockVisibility
					attributes={savedAttributes}
					setAttributes={setAttributes}
				/>

				<PanelBody title={__("Settings")} initialOpen={false}></PanelBody>
			</InspectorControls>
		</>
	);
}
