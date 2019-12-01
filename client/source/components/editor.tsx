import { merge } from "lodash";
import * as React from "react";
import { EditorValue, EditPane, EditPaneValues } from "../elements/editPane";
import { Logo } from "../elements/logo";
import { Marginalia, MarginaliaProps } from "../elements/marginalia";
import { TextTools } from "../elements/text-tools";
import { TipTools } from "../elements/tip-tools";
import { Brain, BrainValues } from "../models/brain";
import { fetch as fetchFortune } from "../models/fortune-cookie";

type EditorState = EditPaneValues & MarginaliaProps & BrainValues;

export class Editor extends React.Component<{}, EditorState> {
	constructor(props: {}) {
		super(props);
		this.state = {
			brainEntries: Brain.createEmpty(),
			editorValue: EditorValue.createEmpty(),
			sourcesToShow: ["fortune cookies", "main editor"],
		};
	}

	public async componentDidMount(): Promise<void> {
		const update = Brain.encloseBrainWriters(this, "fortune cookies");
		await fetchFortune(update);
		await fetchFortune(update);
	}

	public render(): React.ReactElement[] {
		return [
			<Logo key="logo" />,
			<EditPane
				editorIndex={this.state.editorIndex}
				editorTimeout={this.state.editorTimeout}
				editorValue={this.state.editorValue}
				onChange={this.setState.bind(this)}
				writeToBrain={Brain.encloseBrainWriters(this, "main editor")}
				key="editor_pane"
			/>,
			<Marginalia
				brainEntries={this.state.brainEntries}
				key="marginalia"
				sourcesToShow={this.state.sourcesToShow}
			/>,
			<TextTools key="text_tools" />,
			<TipTools key="tip-tools" />,
		];
	}
}
