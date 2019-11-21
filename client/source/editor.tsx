import * as React from "react";
import * as ReactDOM from "react-dom";
import { Editor as EditorPane, EditorValue } from "./components/editor";
import { Logo } from "./components/logo";
import { Marginalia } from "./components/marginalia";
import { TextTools } from "./components/text-tools";
import { TipTools } from "./components/tip-tools";
import { fetch as fetchFortune } from "./models/fetchers/fortune-cookie";

export interface BrainItem {
	title?: string;
	source: string;
	summary?: string;
	fulltext: string;
	text_section?: {
		start: number;
		end: number;
	};
}

export type BrainAdder = (brainItem: BrainItem) => number | null;

class Editor extends React.Component<
	{},
	{ brain: BrainItem[]; editorValue: EditorValue }
> {
	constructor(props: {}) {
		super(props);
		this.state = {
			brain: [],
			editorValue: EditorValue.createEmpty(),
		};
	}

	public async componentDidMount(): Promise<void> {
		await fetchFortune(this.encloseBrainAdder());
	}

	public render(): React.ReactElement[] {
		return [
			<Logo key="logo" />,
			<EditorPane
				editorValue={this.state.editorValue}
				onChange={(editorValue) => {
					this.setState({ editorValue });
				}}
				key="editor_pane"
			/>,
			<Marginalia
				active={this.state.brain}
				key="marginalia"
			/>,
			<TextTools key="text_tools" />,
			<TipTools key="tip-tools" />,
		];
	}

	private encloseBrainAdder(): BrainAdder {
		return (brainItem: BrainItem) => {
			let index = null;
			this.setState((oldState) => {
				const brain = oldState.brain.concat([brainItem]);
				index = brain.length;
				return { brain };
			});
			return index;
		};
	}
}

ReactDOM.render(<Editor />, document.body);
