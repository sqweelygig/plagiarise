import * as Bluebird from "bluebird";
import { Dictionary, isEqual } from "lodash";
import * as QueryString from "query-string";
import { extractKeywords } from "../../helpers/markdown";
import { BrainEntry, BrainValues } from "../brain";
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
			.replace(/\(\)/igm, "")
			.trim();
	}

	private static parseLink(wikitext: string): string {
		const splitMatch = wikitext
			.replace(/^\[\[/gim, "")
			.replace(/]]$/gim, "")
			.split("|");
		const plainText = splitMatch[splitMatch.length - 1];
		const pathText = splitMatch[0].replace(/ /g, "_");
		return `[${plainText}](https://en.wikipedia.org/wiki/${pathText})`;
	}

	private static findFirstSection(wikitext: string): string {
		return WikipediaSkim.parseWikitext(wikitext).split(/^#/gim)[0];
	}

	private static findKeywords(
		props: WikipediaSkimProps & BrainValues,
	): BrainEntry[] {
		const essay = props.brainEntries.find((entry) => {
			return entry.source === props.editorSourceName;
		});
		return essay ? extractKeywords(essay.fulltext) : [];
	}

	private articleIndexes: Dictionary<number> = {};

	public async componentDidUpdate(): Promise<void> {
		const keywords = WikipediaSkim.findKeywords(this.props);
		await Bluebird.map(keywords, async (keyword) => {
			const article = await WikipediaSkim.fetchProperty(
				keyword.fulltext,
				"wikitext",
			);
			this.articleIndexes[keyword.fulltext] = await this.props.updateBrain({
				end: keyword.end,
				fulltext: WikipediaSkim.findFirstSection(article),
				start: keyword.start,
			}, this.articleIndexes[keyword.fulltext]);
		});
	}

	public shouldComponentUpdate(
		nextProps: Readonly<WikipediaSkimProps & BrainValues>,
	): boolean {
		const thisKeywords = WikipediaSkim.findKeywords(this.props);
		const nextKeywords = WikipediaSkim.findKeywords(nextProps);
		return !isEqual(thisKeywords, nextKeywords);
	}
}
