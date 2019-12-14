import { PureComponent, ReactElement } from "react";
import { BrainEntry } from "./brain";

export type BrainWriterFunction = (
	brainItem: BrainEntry | null,
	index?: number,
) => Promise<number>;

export interface WriterProps {
	updateBrain: BrainWriterFunction;
}

export abstract class BrainWriter<T> extends PureComponent<T & WriterProps> {
	public render(): null | ReactElement {
		return null;
	}
}
