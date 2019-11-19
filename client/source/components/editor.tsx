import * as React from "react";
import RichTextEditor, { EditorValue } from "react-rte";

export { EditorValue };

export function Editor(props: {
	editorValue: EditorValue;
	onChange: (editorValue: EditorValue) => Promise<void>;
}): React.ReactElement {
	return <RichTextEditor value={props.editorValue} onChange={props.onChange} />;
}
