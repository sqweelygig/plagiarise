import * as Bluebird from "bluebird";
import * as HtmlToText from "html-to-text";
import * as Request from "request-promise";

type TrainingDataFetcher = () => Promise<string>;

interface Article {
	render: string;
	trainingData: {
		concurrency: number;
		// TODO Consider whether to do this via callback with each data source handling its own concurrency?
		fetchers: TrainingDataFetcher[];
	};
}

export async function fetchArticle(header: string): Promise<Article> {
	const articleParts = await Bluebird.props({
		htmlText: fetchSingularProperty(header, "text"),
		links: fetchPluralProperty(header, "links"),
		plainText: fetchPlainText(header),
	});
	const fetchers = articleParts.links.map((link) => {
		return () => {
			return fetchPlainText(link);
		};
	});
	fetchers.unshift(() => Promise.resolve(articleParts.plainText));
	return {
		render: articleParts.htmlText,
		trainingData: {
			concurrency: 1,
			fetchers,
		},
	};
}

async function fetchPlainText(article: string): Promise<string> {
	const htmlText = await fetchSingularProperty(article, "text");
	return HtmlToText.fromString(htmlText, {
		ignoreHref: true,
		ignoreImage: true,
		uppercaseHeadings: false,
		wordwrap: false,
	}).trim();
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
