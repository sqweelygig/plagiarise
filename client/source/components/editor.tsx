import * as React from "react";
import RichTextEditor, { EditorValue } from "react-rte";

export { EditorValue };

export function Editor(props: {
	editorValue: EditorValue;
	onChange: (editorValue: EditorValue) => void;
}): React.ReactElement {
	return (
		<RichTextEditor
			value={props.editorValue}
			onChange={props.onChange}
			className="editor"
			placeholder="…"
		/>
	);
}
