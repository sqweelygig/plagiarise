import { Component, ReactElement } from "react";
import { extractKeywords } from "../helpers/markdown";
import { BrainCitedEntry, BrainEntry } from "./brain";

export type BrainWriterFunction = (
	brainItem: BrainEntry | null,
	index?: number,
) => Promise<number>;

export interface WriterProps {
	updateBrain: BrainWriterFunction;
}

export interface SingleSource extends WriterProps {
	brainEntry: BrainEntry | null;
}

export interface MultiSource extends WriterProps {
	brainEntries: Array<BrainCitedEntry | null>;
}

export abstract class BrainWriter<T> extends Component<T & WriterProps> {
	protected static extractKeywordsFromProps(props: SingleSource): BrainEntry[] {
		const essay = props.brainEntry ? props.brainEntry.fulltext : "";
		return extractKeywords(essay);
	}

	public render(): null | ReactElement {
		return null;
	}
}
