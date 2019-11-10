import * as Bluebird from "bluebird";
import * as Request from "request-promise";

type TrainingDataFetcher = () => Promise<string>;

interface Article {
	render: string;
	fetchTrainingData: TrainingDataFetcher[];
}

export class Wikipedia {
	public static async fetchArticle(headers: string[]): Promise<Article> {
		const header = headers[headers.length - 1];
		const articleParts = await Bluebird.props({
			htmlText: Wikipedia.fetchSingularProperty(header, "text"),
			links: Wikipedia.fetchPluralProperty(header, "links"),
			plainText: Wikipedia.fetchPlainText(header),
		});
		const fetchTrainingData = articleParts.links.map((link) => {
			return () => {
				return Wikipedia.fetchPlainText(link);
			};
		});
		fetchTrainingData.unshift(() => Promise.resolve(articleParts.plainText));
		return {
			fetchTrainingData,
			render: articleParts.htmlText,
		};
	}

	private static async fetchPlainText(article: string): Promise<string> {
		return Wikipedia.fetchSingularProperty(article, "wikitext");
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
