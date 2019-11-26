import * as React from "react";
import RichTextEditor, { EditorValue } from "react-rte";
import { BrainUpdater } from "../editor";

export { EditorValue };

export interface EditPaneProps {
	editorValue: EditorValue;
	editorIndex?: number;
	editorTimeout?: number;
}

interface EditPaneEvents {
	onChange: (state: Partial<EditPaneProps>) => void;
	updateBrain: BrainUpdater;
}

export function EditPane(
	props: EditPaneProps & EditPaneEvents,
): React.ReactElement {
	const onChange = (editorValue: EditorValue) => {
		if (props.editorTimeout) {
			clearTimeout(props.editorTimeout);
		}
		const holdingEntry = {
			fulltext: "…",
		};
		const editorIndex = props.editorIndex || props.updateBrain(holdingEntry);
		const editorTimeout = setTimeout(() => {
			const entry = {
				fulltext: editorValue.toString("markdown"),
			};
			props.updateBrain(entry, editorIndex);
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
