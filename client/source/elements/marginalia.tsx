import * as React from "react";
import * as ReactMarkdown from "react-markdown";
import { BrainValues } from "../models/brain";

export interface MarginaliaProps extends BrainValues {
	sourcesToShow: string[];
}

export function Marginalia(props: MarginaliaProps): React.ReactElement {
	const brainEntriesToRender = props.brainEntries.filter((entry) => {
		const hasWords = entry.fulltext.replace(/\W/g, "").length > 0;
		const inShowList = props.sourcesToShow.some(
			(source) => entry.source === source,
		);
		return hasWords && inShowList;
	});
	const elements = brainEntriesToRender.map((item, index) => {
		return (
			<div key={["marginalia", index].join("_")}>
				<ReactMarkdown source={item.fulltext} />
				<div className="citation">{item.source}</div>
			</div>
		);
	});
	return <div className={"marginalia"}>{elements}</div>;
}
