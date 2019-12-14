import { Component, ReactElement } from "react";
import { BrainValues } from "./brain";
import { WriterProps } from "./brain-writer";

export type IteratorProps = WriterProps & BrainValues;

export abstract class BrainIterator<T> extends Component<T & IteratorProps> {
	public render(): null | ReactElement {
		return null;
	}
}
