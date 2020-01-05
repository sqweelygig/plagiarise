import * as Bluebird from "bluebird";
import { Dictionary, isEqual } from "lodash";
import { BrainWriter, SingleSource } from "../brain-writer";

export const processWordDefinitions: Dictionary<string> = {
	account:
		"**Account** means to explain the reasons for / clarify / give reasons for.",
	analyse:
		"**Analyse** means to resolve into its component parts, examine critically or minutely.",
	assess: "**Assess** means to determine the value of, weigh up.",
	compare:
		"**Compare** means to look for and show the similarities and differences between examples, perhaps reach a conclusion about which is preferable and justify this.",
	contrast:
		"**Contrast** means to set in opposition in order to bring out the difference - you may also note that there are similarities.",
	criticise:
		"**Criticise** means to make a judgement backed by a reasoned discussion of the evidence involved, describe the merit of theories or opinions or the truth of assertions.",
	define:
		"**Define** mean to give the exact meaning of a word or phrase, perhaps examine different possible or often-used definitions.",
	describe: "**Describe** means to give a detailed account of.",
	differentiate: "**Distinguish** means to look for differences between.",
	discuss:
		"**Discuss** means to explain, then give two sides of the issue and any implications",
	distinguish: "**Distinguish** means to look for differences between.",
	evaluate:
		"**Evaluate** means to make an appraisal of the worth / validity / effectiveness of something (but not so that it is your personal opinion and give evidence from course materials).",
	examine: "**Examine** look in detail at this line of argument",
	explain:
		"**Explain** means to give details about how and why something is so.",
	illustrate:
		"**Illustrate** means to make clear and explicit, and give carefully chosen examples.",
	justify:
		"**Justify** means to give reasons for a point of view, decisions or conclusions, and mention any main objections or arguments against.",
	outline:
		"**Outline** means to give the main features or general principles of a subject, omitting minor details and emphasising structure and arrangement.",
	state: "**State** means to present in a brief, clear way.",
	summarise:
		"**Summarise** means to give a clear, short description, explanation or account, presenting the chief factors and omitting minor details and examples.",
};

export class ProcessWords extends BrainWriter<SingleSource> {
	private articleIndexes: Dictionary<number> = {};

	public async componentDidUpdate(): Promise<void> {
		const keywordEntries = ProcessWords.extractKeywordsFromProps(this.props);
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
				if (
					this.articleIndexes[keyword] === undefined &&
					processWordDefinitions[keyword]
				) {
					this.articleIndexes[keyword] = await this.props.updateBrain(
						{
							end: keywordEntry.end,
							fulltext: processWordDefinitions[keyword],
							start: keywordEntry.start,
						},
						this.articleIndexes[keyword],
					);
				}
			}),
		]);
	}

	public shouldComponentUpdate(nextProps: Readonly<SingleSource>): boolean {
		const thisKeywords = ProcessWords.extractKeywordsFromProps(this.props);
		const nextKeywords = ProcessWords.extractKeywordsFromProps(nextProps);
		return !isEqual(thisKeywords, nextKeywords);
	}
}
