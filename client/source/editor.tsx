import * as React from "react";
import * as ReactDOM from "react-dom";
import { Editor as EditorPane, EditorValue } from "./components/editor";
import { Logo } from "./components/logo";
import { Marginalia } from "./components/marginalia";
import { TextTools } from "./components/text-tools";
import { TipTools } from "./components/tip-tools";

class Editor extends React.Component<{}, { editorValue: EditorValue }> {
	constructor(props: {}) {
		super(props);
		this.state = {
			editorValue: EditorValue.createEmpty(),
		};
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
				before={[<div>Pre 2</div>, <div>Pre 1</div>]}
				after={[<div>Post 1</div>, <div>Post 2</div>]}
				active={<div>Active</div>}
				key="marginalia"
			/>,
			<TextTools key="text_tools" />,
			<TipTools key="tip-tools" />,
		];
	}
}

ReactDOM.render(<Editor />, document.body);
