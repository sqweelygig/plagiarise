import { merge } from "lodash";
import * as React from "react";

export interface BrainValues {
	brainEntries: BrainCitedEntry[];
}

export interface BrainEntry {
	fulltext: string;
	summary?: string;
	textSection?: {
		start: number;
		end: number;
	};
}

export interface BrainCitedEntry extends BrainEntry {
	source: string;
}

export type BrainWriteCallback = (
	brainItem: BrainEntry | null,
	index?: number,
) => number;

export interface BrainWriterFunctions {
	update: BrainWriteCallback;
}

export type SimpleBrainWriter = (
	writers: BrainWriterFunctions,
) => Promise<void>;

export class Brain {
	public static encloseBrainWriters(
		stateStore: React.Component<any, BrainValues>,
		source: string,
	): BrainWriterFunctions {
		const update = (entry: BrainEntry, index?: number) => {
			stateStore.setState((oldState) => {
				const entries = oldState.brainEntries.concat();
				const end = entries.length;
				// If we were given an index, and that entry is ours, then use the index, otherwise add to the end
				const insert = index && entries[index].source === source ? index : end;
				entries[insert] = merge({ source }, entry);
				return { brainEntries: entries };
			});
			// TODO This doesn't respect that setState might be compounded, and should
			const ents = stateStore.state.brainEntries;
			const length = stateStore.state.brainEntries.length;
			return index && ents[index].source === source ? index : length;
		};
		return { update };
	}

	public static createEmpty(): BrainCitedEntry[] {
		return [];
	}
}
