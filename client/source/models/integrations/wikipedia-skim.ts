import * as Bluebird from "bluebird";
import * as QueryString from "query-string";
import { extractKeywords } from "../../helpers/markdown";
import { BrainIterator } from "../brain-iterator";

export interface WikipediaSkimProps {
	editorSourceName: string;
}

export class WikipediaSkim extends BrainIterator<WikipediaSkimProps> {
	private static async fetchResponse(
		article: string,
		property: string,
	): Promise<any> {
		const url = "http://en.wikipedia.org/w/api.php";
		const queryString = QueryString.stringify({
			action: "parse",
			format: "json",
			origin: "*",
			page: article,
			prop: property,
			redirects: true,
		});
		const response = await fetch([url, queryString].join("?"), {
			method: "GET",
		});
		if (response.status !== 200) {
			throw new Error("Server threw error, see network inspector for details.");
		}
		return response.json();
	}

	private static async fetchProperty(
		article: string,
		property: string,
	): Promise<string> {
		const response = await WikipediaSkim.fetchResponse(article, property);
		return response.parse[property]["*"];
	}

	private static parseWikitext(wikitext: string): string {
		return wikitext
			.replace(/<ref.*?<\/ref>/gim, "")
			.replace(/{{[\s\S]*?}}/gim, "")
			.replace(/'''/gim, "**")
			.replace(/''/gim, "*")
			.replace(/^\s*===\s*/gim, "### ")
			.replace(/^\s*==\s*/gim, "## ")
			.replace(/^\s*=\s*/gim, "# ")
			.replace(/\s*===\s*$/gim, "")
			.replace(/\s*==\s*$/gim, "")
			.replace(/\s*=\s*$/gim, "")
			.replace(/\[\[.*?]]/gim, WikipediaSkim.parseLink)
			.trim();
	}

	private static parseLink(wikitext: string): string {
		const splitMatch = wikitext
			.replace(/^\[\[/gim, "")
			.replace(/]]$/gim, "")
			.split("|");
		const plainText = splitMatch[splitMatch.length - 1];
		const pathText = splitMatch[0].replace(" ", "_");
		return `[${plainText}](https://en.wikipedia.org/wiki/${pathText})`;
	}

	private static findFirstSection(wikitext: string): string {
		return WikipediaSkim.parseWikitext(wikitext).split(/^#/gim)[0];
	}

	public async componentDidUpdate(): Promise<void> {
		const essay = this.props.brainEntries.find((entry) => {
			return entry.source === this.props.editorSourceName;
		});
		const keywords = essay ? extractKeywords(essay.fulltext) : [];
		await Bluebird.map(keywords, async (keyword) => {
			const article = await WikipediaSkim.fetchProperty(
				keyword.fulltext,
				"wikitext",
			);
			console.log(WikipediaSkim.findFirstSection(article));
		});
	}
}
