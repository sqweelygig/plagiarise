import { extractKeywords } from "../../helpers/markdown";
import { BrainIterator } from "../brain-iterator";

export interface WikipediaSkimProps {
	editorSourceName: string;
}

export class WikipediaSkim extends BrainIterator<WikipediaSkimProps> {
	public componentDidUpdate(): void {
		const essay = this.props.brainEntries.find((entry) => {
			return entry.source === this.props.editorSourceName;
		});
		const keywords = essay ? extractKeywords(essay.fulltext) : [];
		keywords.forEach((keyword) => {
			console.log(keyword);
		});
	}
}
