import * as React from "react";
import * as ReactMarkdown from "react-markdown";
import { BrainEntry } from "../editor";

export function Marginalia(props: {
	active: BrainEntry[];
}): React.ReactElement {
	const elements = props.active.map((item, index) => {
		return (
			<div key={["marginalia", index].join("_")}>
				<ReactMarkdown source={item.fulltext} />
				<div className="citation">{item.source}</div>
			</div>
		);
	});
	return <div className={"marginalia"}>{elements}</div>;
}
