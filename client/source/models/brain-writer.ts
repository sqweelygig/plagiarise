import { PureComponent, ReactElement } from "react";
import { BrainEntry } from "./brain";

export type BrainWriterFunction = (
	brainItem: BrainEntry | null,
	index?: number,
) => Promise<number>;

export interface BrainWriterFunctions {
	updateBrain: BrainWriterFunction;
}

export abstract class BrainWriter<T> extends PureComponent<
	T & BrainWriterFunctions
> {
	public render(): null | ReactElement {
		return null;
	}
}
