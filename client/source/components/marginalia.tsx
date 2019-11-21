import * as React from "react";
import { BrainItem } from "../editor";

export function Marginalia(props: { active: BrainItem[] }): React.ReactElement {
	const elements = props.active.map((item, index) => {
		return <div key={["marginalia", index].join("_")}>{item.fulltext}</div>;
	});
	return <div className={"marginalia"}>{elements}</div>;
}
