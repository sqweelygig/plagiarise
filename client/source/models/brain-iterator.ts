import { PureComponent, ReactElement } from "react";
import { BrainValues } from "./brain";
import { BrainWriterFunctions } from "./brain-writer";

export type BrainUpdaterProps = BrainWriterFunctions & BrainValues;

export abstract class BrainIterator<T> extends PureComponent<
	T & BrainUpdaterProps
> {
	public render(): null | ReactElement {
		return null;
	}
}
