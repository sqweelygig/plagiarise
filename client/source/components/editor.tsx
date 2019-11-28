import { merge } from "lodash";
import * as React from "react";
import { EditorValue, EditPane, EditPaneValues } from "../elements/editPane";
import { Logo } from "../elements/logo";
import { Marginalia, MarginaliaProps } from "../elements/marginalia";
import { TextTools } from "../elements/text-tools";
import { TipTools } from "../elements/tip-tools";
import { fetch as fetchFortune } from "../models/fortune-cookie";

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

export type BrainWriteCallback = (
	brainItem: BrainEntry | null,
	index?: number,
) => number;

export interface BrainWriterFunctions {
	update: BrainWriteCallback;
}

export type SimpleBrainWriter = (
	writers: BrainWriterFunctions,
) => Promise<void>;

interface Brain {
	brain: BrainCitedEntry[];
}

type EditorState = EditPaneValues & MarginaliaProps & Brain;

export class Editor extends React.Component<{}, EditorState> {
	constructor(props: {}) {
		super(props);
		this.state = {
			brain: [],
			editorValue: EditorValue.createEmpty(),
			sourcesToShow: ["fortune cookies", "main editor"],
		};
	}

	public async componentDidMount(): Promise<void> {
		const update = this.encloseBrainWriters("fortune cookies");
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
				writeToBrain={this.encloseBrainWriters("main editor")}
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

	private encloseBrainWriters(source: string): BrainWriterFunctions {
		const update = (entry: BrainEntry, index?: number) => {
			this.setState((oldState) => {
				const brain = oldState.brain.concat();
				const end = brain.length;
				// If we were given an index, and that entry is ours, then use the index, otherwise add to the end
				const insert = index && brain[index].source === source ? index : end;
				brain[insert] = merge({ source }, entry);
				return { brain };
			});
			// TODO This doesn't respect that setState might be compounded
			const state = this.state;
			const length = state.brain.length;
			return index && state.brain[index].source === source ? index : length;
		};
		return { update };
	}
}
