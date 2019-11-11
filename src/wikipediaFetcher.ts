import * as Bluebird from "bluebird";
import * as HtmlToText from "html-to-text";
import * as KeywordExtractor from "keyword-extractor";
import * as Request from "request-promise";
import { TextEditorProps } from "./plagiarise";

export async function fetchArticle(params: {
	textEditorProps: TextEditorProps;
	updateRender: (render: string, location: number | undefined) => void;
	appendTrainingData: (trainingData: string) => void;
	reportError: (error: Error) => void;
}): Promise<void> {
	const links: string[] = [];
	const headers = params.textEditorProps.text.matchAll(/^#+.+/gm) || [];
	for (const headerMatch of headers) {
		const header = headerMatch[0].replace(/^#+/, "").trim();
		const keywords = KeywordExtractor.extract(header);
		await Bluebird.each(keywords, async (keyword) => {
			const htmlArticle = await fetchSingularProperty(keyword, "text");
			params.updateRender(htmlArticle, headerMatch.index);
			links.push(keyword);
			const fetchedLinks = await fetchPluralProperty(keyword, "links");
			fetchedLinks.forEach((link) => links.push(link));
		});
	}
	await Bluebird.each(links, async (link) => {
		try {
			const linkedPlainText = await fetchPlainText(link);
			params.appendTrainingData(`${link}.  ${linkedPlainText}`);
		} catch (error) {
			params.reportError(error);
		}
	});
}

function parseHtmlText(htmlText: string): string {
	const text = HtmlToText.fromString(htmlText, {
		ignoreHref: true,
		ignoreImage: true,
		uppercaseHeadings: false,
		wordwrap: false,
	});
	return text.replace(/\[\d+]/g, "").trim();
}

async function fetchPlainText(article: string): Promise<string> {
	const htmlText = await fetchSingularProperty(article, "text");
	const cleanedText = htmlText.replace(/<table[\s\S]*?<\/table>/g, "");
	return parseHtmlText(cleanedText);
}

async function fetchSingularProperty(
	article: string,
	property: string,
): Promise<string> {
	const response = await fetchResponse(article, property);
	return response.parse[property]["*"];
}

async function fetchPluralProperty(
	article: string,
	property: string,
): Promise<string[]> {
	const response = await fetchResponse(article, property);
	return response.parse[property].map((prop: any) => prop["*"]);
}

async function fetchResponse(article: string, property: string): Promise<any> {
	return Request.get("http://en.wikipedia.org/w/api.php", {
		json: true,
		qs: {
			action: "parse",
			format: "json",
			page: article,
			prop: property,
			redirects: true,
		},
	});
}
