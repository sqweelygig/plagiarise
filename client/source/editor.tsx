import { merge } from "lodash";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { Editor as EditorPane, EditorValue } from "./components/editor";
import { Logo } from "./components/logo";
import { Marginalia } from "./components/marginalia";
import { TextTools } from "./components/text-tools";
import { TipTools } from "./components/tip-tools";
import { fetch as fetchFortune } from "./models/fortune-cookie";

export interface BrainSubmission {
	fulltext: string;
	summary?: string;
	textSection?: {
		start: number;
		end: number;
	};
}

export type BrainEntry = BrainSubmission & { source: string };

export type BrainUpdater = (
	brainItem: BrainSubmission,
	index?: number,
) => number | undefined;

interface EditorState {
	brain: BrainEntry[];
	editorBrainIndex?: number;
	editorValue: EditorValue;
	editorTimeout?: number;
	sourcesToShow: string[];
}

class Editor extends React.Component<{}, EditorState> {
	constructor(props: {}) {
		super(props);
		this.state = {
			brain: [],
			editorValue: EditorValue.createEmpty(),
			sourcesToShow: ["fortune cookies"],
		};
	}

	public async componentDidMount(): Promise<void> {
		await fetchFortune(this.encloseBrainUpdater("fortune cookies"));
		await fetchFortune(this.encloseBrainUpdater("fortune cookies"));
	}

	public render(): React.ReactElement[] {
		const brainEntriesToRender = this.state.brain.filter((entry) => {
			const hasWords = entry.fulltext.replace(/\W/g, "").length > 0;
			const inShowList = this.state.sourcesToShow.some(
				(source) => entry.source === source,
			);
			return hasWords && inShowList;
		});
		return [
			<Logo key="logo" />,
			<EditorPane
				editorValue={this.state.editorValue}
				onChange={this.encloseEditorUpdater()}
				key="editor_pane"
			/>,
			<Marginalia active={brainEntriesToRender} key="marginalia" />,
			<TextTools key="text_tools" />,
			<TipTools key="tip-tools" />,
		];
	}

	// TODO This awareness that the text editor updates the brain feels like it belongs in components/editor.tsx
	private encloseEditorUpdater(): (editorValue: EditorValue) => void {
		return (editorValue: EditorValue) => {
			if (this.state.editorTimeout) {
				clearTimeout(this.state.editorTimeout);
			}
			this.setState({ editorValue });
			const editorTimeout = setTimeout(() => {
				this.setState((oldState) => {
					const source = "main editor";
					const entry = {
						fulltext: oldState.editorValue.toString("markdown"),
						source,
					};
					const brain = oldState.brain.concat();
					const lookup = oldState.editorBrainIndex;
					// If we have an index, and that entry is ours, then use the index, else add to the end
					const insertionPoint =
						lookup && brain[lookup].source === source ? lookup : brain.length;
					brain[insertionPoint] = entry;
					return { brain, editorBrainIndex: insertionPoint, editorTimeout };
				});
			}, 500);
		};
	}

	private encloseBrainUpdater(source: string): BrainUpdater {
		return (submission: BrainSubmission, index?: number) => {
			this.setState((oldState) => {
				const entry = merge({ source }, submission);
				const brain = oldState.brain.concat();
				// If we were given an index, and that entry is ours, then use the index, else add to the end
				index = index && brain[index].source === source ? index : brain.length;
				brain[index] = entry;
				return { brain };
			});
			return index;
		};
	}
}

ReactDOM.render(<Editor />, document.body);
