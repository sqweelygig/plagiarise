import * as React from "react";
import RichTextEditor, { EditorValue } from "react-rte";
import { BrainWriterFunctions } from "../editor";

export { EditorValue };

export interface EditPaneProps {
	editorValue: EditorValue;
	editorIndex?: number;
	editorTimeout?: number;
}

interface EditPaneEvents {
	onChange: (state: Partial<EditPaneProps>) => void;
	writeToBrain: BrainWriterFunctions;
}

export function EditPane(
	props: EditPaneProps & EditPaneEvents,
): React.ReactElement {
	const onChange = (editorValue: EditorValue) => {
		if (props.editorTimeout) {
			clearTimeout(props.editorTimeout);
		}
		const holding = {
			fulltext: "…",
		};
		const editorIndex = props.editorIndex || props.writeToBrain.update(holding);
		const editorTimeout = setTimeout(() => {
			const entry = {
				fulltext: editorValue.toString("markdown"),
			};
			props.writeToBrain.update(entry, editorIndex);
		}, 1000);
		props.onChange({ editorIndex, editorTimeout, editorValue });
	};
	return (
		<RichTextEditor
			value={props.editorValue}
			onChange={onChange}
			className="editor"
			placeholder="…"
		/>
	);
}
