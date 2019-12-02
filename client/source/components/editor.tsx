import { merge } from "lodash";
import * as React from "react";
import { EditorValue, EditPane, EditPaneValues } from "../elements/edit-pane";
import { Logo } from "../elements/logo";
import { Marginalia, MarginaliaProps } from "../elements/marginalia";
import { TextTools } from "../elements/text-tools";
import { TipTools } from "../elements/tip-tools";
import { Brain, BrainValues } from "../models/brain";
import { FortuneCookie } from "../models/integrations/fortune-cookie";
import { WikipediaSkim } from "../models/integrations/wikipedia-skim";

type EditorState = EditPaneValues & MarginaliaProps & BrainValues;

type StateUpdater = (oldState: EditorState) => Partial<EditorState>;

type SetStateAction = Partial<EditorState> | StateUpdater;

export type SetState = (setStateAction: SetStateAction) => void;

export class Editor extends React.Component<{}, EditorState> {
	private readonly brain: Brain;

	constructor(props: {}) {
		super(props);
		this.state = {
			brainEntries: Brain.createEmpty(),
			editorValue: EditorValue.createEmpty(),
			sourcesToShow: ["fortune cookies", "main editor"],
		};
		this.brain = new Brain(this.setState.bind(this));
	}

	public render(): React.ReactElement[] {
		return [
			<WikipediaSkim
				editorSourceName="main editor"
				brainEntries={this.state.brainEntries}
				updateBrain={this.brain.encloseBrainWriter("wikipedia")}
			/>,
			<FortuneCookie
				updateBrain={this.brain.encloseBrainWriter("fortune cookies")}
			/>,
			<Logo key="logo" />,
			<EditPane
				editorIndex={this.state.editorIndex}
				editorTimeout={this.state.editorTimeout}
				editorValue={this.state.editorValue}
				onChange={this.promisifyAndBindSetState()}
				updateBrain={this.brain.encloseBrainWriter("main editor")}
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

	private promisifyAndBindSetState(): (
		state: Partial<EditorState>,
	) => Promise<EditorState> {
		return (state: Partial<EditorState>) => {
			return new Promise<EditorState>((resolve) => {
				this.setState((oldState: Readonly<EditorState>) => {
					const newState = merge({}, oldState, state);
					resolve(newState);
					return newState;
				});
			});
		};
	}
}
