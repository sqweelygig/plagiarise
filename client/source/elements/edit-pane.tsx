import * as React from "react";
import RichTextEditor, { EditorValue } from "react-rte";
import { BrainWriter, WriterProps } from "../models/brain-writer";
export { EditorValue };

export interface EditPaneValues {
	editorValue: EditorValue;
	editorIndex?: number;
	editorTimeout?: number;
}

type EditPaneUpdater = (
	state: Partial<EditPaneValues>,
) => Promise<EditPaneValues>;

interface EditPaneEvents {
	onChange: EditPaneUpdater;
}

type EditPaneProps = EditPaneEvents & EditPaneValues & WriterProps;

export class EditPane extends BrainWriter<EditPaneProps> {
	constructor(props: EditPaneProps) {
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

	private encloseOnChange(): (editorValue: EditorValue) => Promise<void> {
		return async (editorValue: EditorValue) => {
			if (this.props.editorTimeout) {
				window.clearTimeout(this.props.editorTimeout);
			}
			const editorTimeout = window.setTimeout(async () => {
				const fulltext = editorValue.toString("markdown");
				const editorIndex = await this.props.updateBrain(
					{ fulltext },
					this.props.editorIndex,
				);
				await this.props.onChange({ editorIndex });
			}, 1000);
			await this.props.onChange({ editorTimeout, editorValue });
		};
	}
}
