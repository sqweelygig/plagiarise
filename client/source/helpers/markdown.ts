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
			const finder = new RegExp(keyword, "ig");
			let match = finder.exec(header.fulltext);
			while (match) {
				const location = header.location && {
					end: header.location.start + match.index + match[0].length,
					start: header.location.start + match.index,
				};
				keywordEntries.push({
					fulltext: keyword,
					location,
				});
				match = finder.exec(header.fulltext);
			}
		});
	});
	return keywordEntries;
}
