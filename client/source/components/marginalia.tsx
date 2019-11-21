import * as React from "react";
import { BrainItem } from "../editor";

export function Marginalia(props: { active: BrainItem[] }): React.ReactElement {
	const elements = props.active.map((item, index) => {
		return (
			<div key={["marginalia", index].join("_")}>
				<div>{item.fulltext}</div>
				<div className="citation">{item.source}</div>
			</div>
		);
	});
	return <div className={"marginalia"}>{elements}</div>;
}
