import * as React from "react";

export function Marginalia(props: {
	before: React.ReactElement[];
	active?: React.ReactElement;
	after: React.ReactElement[];
}): React.ReactElement {
	return <div className={"marginalia"}>Marginalia here!</div>;
}
