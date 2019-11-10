/* tslint:disable:no-console */
import * as Bluebird from "bluebird";
import * as Chalk from "chalk";
import { fetchArticle as fetchWikipediaArticle } from "./wikipediaFetcher";

class Plagarise {
	private static log(params: {
		error?: boolean;
		headline: string;
		detail?: string;
	}): void {
		const outputFunction = params.error
			? console.error.bind(console)
			: console.log.bind(console);
		const headline = params.error
			? Chalk.red(params.headline)
			: Chalk.blue(params.headline);
		params.detail
			? outputFunction(headline, params.detail)
			: outputFunction(headline);
	}

	private static updateRender(render: string): void {
		Plagarise.log({
			detail: render.split(/\n/, 1)[0],
			headline: "Presenting article:",
		});
	}

	private static reportError(error: Error): void {
		Plagarise.log({
			detail: error.message,
			error: true,
			headline: "Oh no!",
		});
	}

	private readonly trainingData: string[] = [];
	private previousCount = 0;
	private readonly timeouts: NodeJS.Timeout[] = [];

	public async start(): Promise<void> {
		Plagarise.log({ headline: "Hello World!" });
		this.startMonitor();
		await Bluebird.props({
			wikipedia: fetchWikipediaArticle({
				appendTrainingData: this.makeDataAppender(),
				header: "plagiarism",
				reportError: Plagarise.reportError,
				updateRender: Plagarise.updateRender,
			}),
		});
	}

	public stop(): void {
		Plagarise.log({
			detail: [this.trainingData.length.toString(), "articles"].join(" "),
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
				Plagarise.log({
					detail: [
						this.trainingData.length.toString(),
						"articles,",
						(this.trainingData.length - this.previousCount).toString(),
						"new.",
					].join(" "),
					headline: "Article statistics:",
				});
				this.previousCount = this.trainingData.length;
			}
		};
	}

	private makeDataAppender(): (newData: string) => void {
		return (newData: string) => {
			Plagarise.log({
				detail: newData.split(/\n/, 1)[0],
				headline: "Learnt article:",
			});
			this.trainingData.push(newData);
		};
	}
}

const plagiarise = new Plagarise();
plagiarise.start().then(plagiarise.stop);
