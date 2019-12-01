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

export interface BrainWriterFunctions {
	update: (brainItem: BrainEntry | null, index?: number) => Promise<number>;
}

export type SimpleBrainWriter = (
	writers: BrainWriterFunctions,
) => Promise<void>;

export class Brain {
	public static encloseBrainWriters(
		stateStore: React.Component<any, BrainValues>,
		source: string,
	): BrainWriterFunctions {
		const update = async (entry: BrainEntry, index?: number) => {
			return new Promise<number>((resolve) => {
				stateStore.setState((oldState) => {
					const entries = oldState.brainEntries.concat();
					const end = entries.length;
					// If we were given an index, and that entry is ours, then use the index, otherwise add to the end
					const i = index;
					const insert = i && entries[i].source === source ? i : end;
					entries[insert] = merge({ source }, entry);
					resolve(insert);
					return { brainEntries: entries };
				});
			});
		};
		return { update };
	}

	public static createEmpty(): BrainCitedEntry[] {
		return [];
	}
}
