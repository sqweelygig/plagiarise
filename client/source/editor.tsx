import { merge } from "lodash";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { EditorValue, EditPane, EditPaneProps } from "./components/editPane";
import { Logo } from "./components/logo";
import { Marginalia, MarginaliaProps } from "./components/marginalia";
import { TextTools } from "./components/text-tools";
import { TipTools } from "./components/tip-tools";
import { fetch as fetchFortune } from "./models/fortune-cookie";

export interface BrainEntry {
	fulltext: string;
	summary?: string;
	textSection?: {
		start: number;
		end: number;
	};
}

export interface BrainCitedEntry extends BrainEntry {
	source: string;
}

export type BrainUpdater = (
	brainItem: BrainEntry,
	index?: number,
) => number | undefined;

interface Brain {
	brain: BrainCitedEntry[];
}

type EditorState = EditPaneProps & MarginaliaProps & Brain;

class Editor extends React.Component<{}, EditorState> {
	constructor(props: {}) {
		super(props);
		this.state = {
			brain: [],
			editorValue: EditorValue.createEmpty(),
			sourcesToShow: ["fortune cookies", "main editor"],
		};
	}

	public async componentDidMount(): Promise<void> {
		await fetchFortune(this.encloseBrainUpdater("fortune cookies"));
		await fetchFortune(this.encloseBrainUpdater("fortune cookies"));
	}

	public render(): React.ReactElement[] {
		return [
			<Logo key="logo" />,
			<EditPane
				editorIndex={this.state.editorIndex}
				editorTimeout={this.state.editorTimeout}
				editorValue={this.state.editorValue}
				onChange={this.encloseEditorUpdater()}
				updateBrain={this.encloseBrainUpdater("main editor")}
				key="editor_pane"
			/>,
			<Marginalia
				brain={this.state.brain}
				key="marginalia"
				sourcesToShow={this.state.sourcesToShow}
			/>,
			<TextTools key="text_tools" />,
			<TipTools key="tip-tools" />,
		];
	}

	private encloseEditorUpdater(): (state: EditPaneProps) => void {
		return (state: EditPaneProps) => {
			this.setState(state);
		};
	}

	private encloseBrainUpdater(source: string): BrainUpdater {
		return (entry: BrainEntry, index?: number) => {
			this.setState((oldState) => {
				const brain = oldState.brain.concat();
				const end = brain.length;
				// If we were given an index, and that entry is ours, then use the index, otherwise add to the end
				const insert = index && brain[index].source === source ? index : end;
				brain[insert] = merge({ source }, entry);
				return { brain };
			});
			// TODO This doesn't respect that setState might be compound
			const state = this.state;
			const length = state.brain.length;
			return index && state.brain[index].source === source ? index : length;
		};
	}
}

ReactDOM.render(<Editor />, document.body);
