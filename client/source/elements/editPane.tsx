import * as React from "react";
import RichTextEditor, { EditorValue } from "react-rte";
import { BrainWriterFunctions } from "../models/brain";
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

	private encloseOnChange(): (editorValue: EditorValue) => Promise<void> {
		return async (editorValue: EditorValue) => {
			if (this.props.editorTimeout) {
				clearTimeout(this.props.editorTimeout);
			}
			const editorTimeout = setTimeout(async () => {
				const fulltext = editorValue.toString("markdown");
				const editorIndex = await this.props.writeToBrain.update(
					{ fulltext },
					this.props.editorIndex,
				);
				await this.props.onChange({ editorIndex });
			}, 1000);
			await this.props.onChange({ editorTimeout, editorValue });
		};
	}
}
