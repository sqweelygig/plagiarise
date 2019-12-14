import * as KeywordExtractor from "keyword-extractor";
import { BrainEntry } from "../models/brain";

export function extractHeaders(essay: string): BrainEntry[] {
	const findHeading = /^#+ *.+/gim;
	const headers: BrainEntry[] = [];
	let match = findHeading.exec(essay);
	while (match) {
		headers.push({
			end: match.index + match[0].length,
			fulltext: match[0],
			start: match.index,
		});
		match = findHeading.exec(essay);
	}
	return headers;
}

export function extractKeywords(essay: string): BrainEntry[] {
	const headers = essay ? extractHeaders(essay) : [];
	const keywordEntries: BrainEntry[] = [];
	headers.forEach((header) => {
		const trimmedText = header.fulltext.replace(/^#*/, "").trim();
		const keywords = KeywordExtractor.extract(trimmedText);
		keywords.forEach((keyword) => {
			if (keyword.trim().length > 1) {
				const finder = new RegExp(keyword, "i");
				const match = header.fulltext.match(finder);
				const offset = match && match.index !== undefined ? match.index : 0;
				const length = match && match[0] !== undefined ? match[0].length : 0;
				const origin = header.start;
				const start = origin !== undefined ? origin + offset : undefined;
				const end = origin !== undefined ? origin + offset + length : undefined;
				keywordEntries.push({
					end,
					fulltext: keyword,
					start,
				});
			}
		});
	});
	return keywordEntries;
}
