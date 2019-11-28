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
	public static createEmpty(): BrainCitedEntry[] {
		return [];
	}
}
