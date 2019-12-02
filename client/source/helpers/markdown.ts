import * as KeywordExtractor from "keyword-extractor";
import { BrainEntry } from "../models/brain";

export function extractHeaders(essay: string): BrainEntry[] {
	const findHeading = /^#+ *.+/g;
	const returnValue: BrainEntry[] = [];
	let match = findHeading.exec(essay);
	while (match) {
		returnValue.push({
			fulltext: match[0],
			location: {
				end: match.index + match[0].length,
				start: match.index,
			},
		});
		match = findHeading.exec(essay);
	}
	return returnValue;
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
				const start = header.location ? header.location.start + offset : 0;
				const end = header.location ? start + length : 0;
				const location = header.location ? { end, start } : undefined;
				keywordEntries.push({
					fulltext: keyword,
					location,
				});
			}
		});
	});
	return keywordEntries;
}
