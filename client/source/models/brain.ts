import { merge } from "lodash";
import { SetState } from "../components/editor";
import { BrainWriterFunction } from "./brain-writer";

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

export class Brain {
	public static createEmpty(): BrainCitedEntry[] {
		return [];
	}

	constructor(private readonly setState: SetState) {}

	public encloseBrainWriter(source: string): BrainWriterFunction {
		return (entry: BrainEntry, index?: number) => {
			return new Promise<number>((resolve) => {
				this.setState((oldState) => {
					const brainEntries = [...oldState.brainEntries];
					const end = brainEntries.length;
					const i = index;
					// If we were given an index, and that entry is ours, then use the index, otherwise add to the end
					const insert = i && brainEntries[i].source === source ? i : end;
					brainEntries[insert] = merge({ source }, entry);
					setTimeout(() => {
						resolve(insert);
					}, 0);
					return { brainEntries };
				});
			});
		};
	}
}
