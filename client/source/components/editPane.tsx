import * as React from "react";
import RichTextEditor, { EditorValue } from "react-rte";
import { BrainWriterFunctions } from "../editor";
export { EditorValue };

export interface EditPaneValues {
	editorValue: EditorValue;
	editorIndex?: number;
	editorTimeout?: number;
}

type EditPaneUpdater = (state: Partial<EditPaneValues>) => void;

interface EditPaneEvents {
	onChange: EditPaneUpdater;
	writeToBrain: BrainWriterFunctions;
}

type EditPaneProps = EditPaneEvents & EditPaneValues;

export class EditPane extends React.PureComponent<EditPaneProps> {
	constructor(props: EditPaneValues & EditPaneEvents) {
		super(props);
	}

	public render(): React.ReactElement {
		return (
			<RichTextEditor
				value={this.props.editorValue}
				onChange={this.encloseOnChange()}
				className="editor"
				placeholder="…"
			/>
		);
	}

	private ensureBrainEntry(): number {
		const holding = {
			fulltext: "…",
		};
		return this.props.editorIndex || this.props.writeToBrain.update(holding);
	}

	private encloseOnChange(): (editorValue: EditorValue) => void {
		return (editorValue: EditorValue) => {
			if (this.props.editorTimeout) {
				clearTimeout(this.props.editorTimeout);
			}
			const editorIndex = this.ensureBrainEntry();
			const editorTimeout = setTimeout(
				this.encloseBrainUpdater(editorValue, editorIndex),
				1000,
			);
			this.props.onChange({ editorIndex, editorTimeout, editorValue });
		};
	}

	private encloseBrainUpdater(
		editorValue: EditorValue,
		editorIndex: number,
	): () => void {
		return () => {
			const fulltext = editorValue.toString("markdown");
			this.props.writeToBrain.update({ fulltext }, editorIndex);
		};
	}
}
