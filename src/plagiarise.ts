import * as Bluebird from "bluebird";
import * as Chalk from "chalk";
import { fetchArticle as fetchWikipediaArticle } from "./wikipediaFetcher";

export interface TextEditorProps {
	cursorPosition: number;
	text: string;
	title: string;
	wordCount: number;
}

class Plagiarise {
	private static log(params: {
		error?: boolean;
		headline: string;
		detail?: string;
	}): void {
		/* tslint:disable:no-console */
		const outputFunction = params.error
			? console.error.bind(console)
			: console.log.bind(console);
		/* tslint:enable:no-console */
		const headline = params.error
			? Chalk.red(params.headline)
			: Chalk.blue(params.headline);
		params.detail
			? outputFunction(headline, params.detail)
			: outputFunction(headline);
	}

	private static updateRender(render: string): void {
		Plagiarise.log({
			detail: render.split(/\n/, 1)[0],
			headline: "Presenting article:",
		});
	}

	private static reportError(error: Error): void {
		Plagiarise.log({
			detail: error.message,
			error: true,
			headline: "Oh no!",
		});
	}

	private readonly trainingData: string[] = [];
	private previousCount = 0;
	private readonly timeouts: NodeJS.Timeout[] = [];

	public async start(): Promise<void> {
		Plagiarise.log({ headline: "Hello World!" });
		this.startMonitor();
		await Bluebird.props({
			wikipedia: fetchWikipediaArticle({
				appendTrainingData: this.makeDataAppender(),
				reportError: Plagiarise.reportError,
				textEditorProps: {
					cursorPosition: 0,
					text: "",
					title: "Plagiarism",
					wordCount: 50,
				},
				updateRender: Plagiarise.updateRender,
			}),
		});
	}

	public stop(): void {
		Plagiarise.log({
			detail: `${this.trainingData.length.toString()} articles`,
			headline: "Final statistics",
		});
		this.timeouts.forEach(clearInterval);
	}

	private startMonitor(): void {
		const monitor = setInterval(this.makeMonitor(), 5000);
		this.timeouts.push(monitor);
	}

	private makeMonitor(): () => void {
		return () => {
			if (this.trainingData.length !== this.previousCount) {
				const articles = this.trainingData.length.toString();
				const newArticles = (
					this.trainingData.length - this.previousCount
				).toString();
				Plagiarise.log({
					detail: `${articles} articles, ${newArticles} new.`,
					headline: "Article statistics:",
				});
				this.previousCount = this.trainingData.length;
			}
		};
	}

	private makeDataAppender(): (newData: string) => void {
		return (newData: string) => {
			Plagiarise.log({
				detail: newData.split(/[\r\n]/, 1)[0],
				headline: "Learnt article:",
			});
			this.trainingData.push(newData);
		};
	}
}

const plagiarise = new Plagiarise();
plagiarise.start().then(() => {
	plagiarise.stop();
});
