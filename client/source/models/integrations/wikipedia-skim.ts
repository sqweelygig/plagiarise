import * as Bluebird from "bluebird";
import { Dictionary, isEqual } from "lodash";
import * as QueryString from "query-string";
import { BrainWriter, SingleSource } from "../brain-writer";
import { processWordDefinitions } from "./process-words";

export class WikipediaSkim extends BrainWriter<SingleSource> {
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
			.replace(/\(\)/gim, "")
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

	private articleIndexes: Dictionary<number> = {};

	public async componentDidUpdate(): Promise<void> {
		const allKeywords = WikipediaSkim.extractKeywordsFromProps(this.props);
		const keywordEntries = allKeywords.filter((entry) => {
			return (
				entry.fulltext.trim().length > 0 &&
				processWordDefinitions[entry.fulltext] === undefined
			);
		});
		const keywords = keywordEntries.map((keywordEntry) => {
			return keywordEntry.fulltext;
		});
		await Bluebird.all([
			await Bluebird.map(Object.keys(this.articleIndexes), async (keyword) => {
				if (keywords.indexOf(keyword) === -1) {
					await this.props.updateBrain(null, this.articleIndexes[keyword]);
					delete this.articleIndexes[keyword];
				}
			}),
			await Bluebird.map(keywordEntries, async (keywordEntry) => {
				const keyword = keywordEntry.fulltext;
				if (this.articleIndexes[keyword] === undefined) {
					const article = await WikipediaSkim.fetchProperty(
						keyword,
						"wikitext",
					);
					this.articleIndexes[keyword] = await this.props.updateBrain(
						{
							end: keywordEntry.end,
							fulltext: WikipediaSkim.findFirstSection(article),
							start: keywordEntry.start,
						},
						this.articleIndexes[keyword],
					);
				}
			}),
		]);
	}

	public shouldComponentUpdate(nextProps: Readonly<SingleSource>): boolean {
		const thisKeywords = WikipediaSkim.extractKeywordsFromProps(this.props);
		const nextKeywords = WikipediaSkim.extractKeywordsFromProps(nextProps);
		return !isEqual(thisKeywords, nextKeywords);
	}
}
