import * as React from "react";
import * as ReactDOM from "react-dom";
import { Editor } from "./components/editor";
import { Logo } from "./components/logo";
import { Marginalia } from "./components/marginalia";
import { TextTools } from "./components/text-tools";
import { TipTools } from "./components/tip-tools";

const before = [
	<div>Pre 2</div>,
	<div>Pre 1</div>,
];
const after = [
	<div>Post 1</div>,
	<div>Post 2</div>,
];
const active = <div>Active</div>;

ReactDOM.render(
	[
		<Logo />,
		<Editor />,
		<Marginalia before={before} after={after} active={active} />,
		<TextTools />,
		<TipTools />,
	],
	document.body,
);
