import * as React from "react";

export function Marginalia(props: {
	before: React.ReactElement[];
	active?: React.ReactElement;
	after: React.ReactElement[];
}) {
	return (
		<div className={"marginalia"}>
			<div>{props.before}</div>
			{props.active}
			<div>{props.after}</div>
		</div>
	);
}
