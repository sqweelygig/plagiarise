import { merge } from "lodash";
import { SetState } from "../components/editor";
import { extractKeywords } from "../helpers/markdown";
import { BrainWriterFunction } from "./brain-writer";

export interface BrainValues {
	brainEntries: Array<BrainCitedEntry | null>;
}

export interface BrainEntry {
	fulltext: string;
	summary?: string;
	start?: number;
	end?: number;
}

export interface BrainCitedEntry extends BrainEntry {
	source: string;
}

export interface SingleSource {
	sourceName: string;
}

export function findKeywords(props: SingleSource & BrainValues): BrainEntry[] {
	const essay = Brain.findEntry(props.brainEntries, props.sourceName);
	return essay ? extractKeywords(essay.fulltext) : [];
}

export class Brain {
	public static createEmpty(): BrainCitedEntry[] {
		return [];
	}

	public static findEntry(
		entries: Array<BrainCitedEntry | null>,
		source: string,
	): BrainEntry | undefined {
		const needle = entries.find((entry) => {
			return entry && entry.source === source;
		});
		return needle || undefined;
	}

	constructor(private readonly setState: SetState) {}

	public encloseBrainWriter(source: string): BrainWriterFunction {
		return (submission: BrainEntry | null, index?: number) => {
			return new Promise<number>((resolve) => {
				this.setState((oldState) => {
					const brainEntries = [...oldState.brainEntries];
					const end = brainEntries.length;
					const i = index;
					const entry = i && brainEntries[i];
					// If we were given an index, and that entry is ours, then ...
					// update the entry at the index, otherwise add to the end
					const insert = i && entry && entry.source === source ? i : end;
					brainEntries[insert] = merge({ source }, submission);
					setTimeout(() => {
						resolve(insert);
					}, 0);
					return { brainEntries };
				});
			});
		};
	}
}
