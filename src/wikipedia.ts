import * as Bluebird from "bluebird";
import * as HtmlToText from "html-to-text";
import * as Request from "request-promise";

type TrainingDataFetcher = () => Promise<string>;

interface Article {
	render: string;
	trainingData: {
		concurrency: number;
		fetchers: TrainingDataFetcher[];
	};
}

export class Wikipedia {
	public static async fetchArticle(header: string): Promise<Article> {
		const articleParts = await Bluebird.props({
			htmlText: Wikipedia.fetchSingularProperty(header, "text"),
			links: Wikipedia.fetchPluralProperty(header, "links"),
			plainText: Wikipedia.fetchPlainText(header),
		});
		const fetchers = articleParts.links.map((link) => {
			return () => {
				return Wikipedia.fetchPlainText(link);
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

	private static async fetchPlainText(article: string): Promise<string> {
		const htmlText = await Wikipedia.fetchSingularProperty(article, "text");
		return HtmlToText.fromString(htmlText, {
			ignoreHref: true,
			ignoreImage: true,
			uppercaseHeadings: false,
			wordwrap: false,
		}).trim();
	}

	private static async fetchSingularProperty(
		article: string,
		property: string,
	): Promise<string> {
		const response = await Request.get("http://en.wikipedia.org/w/api.php", {
			json: true,
			qs: {
				action: "parse",
				format: "json",
				page: article,
				prop: property,
				redirects: true,
			},
		});
		return response.parse[property]["*"];
	}

	private static async fetchPluralProperty(
		article: string,
		property: string,
	): Promise<string[]> {
		const response = await Request.get("http://en.wikipedia.org/w/api.php", {
			json: true,
			qs: {
				action: "parse",
				format: "json",
				page: article,
				prop: property,
				redirects: true,
			},
		});
		return response.parse[property].map((prop: any) => prop["*"]);
	}
}
