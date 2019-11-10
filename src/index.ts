/* tslint:disable:no-console */
import * as Bluebird from "bluebird";
import * as Chalk from "chalk";
import { WikipediaFetcher } from "./wikipediaFetcher";

function log(params: { error?: boolean; headline: string; detail?: string }) {
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

async function start(): Promise<NodeJS.Timeout[]> {
	log({ headline: "Hello World!" });
	const trainingData = [];
	let previousCount = 0;
	const monitor = setInterval(() => {
		if (trainingData.length !== previousCount) {
			log({
				detail: [
					trainingData.length.toString(),
					"articles,",
					(trainingData.length - previousCount).toString(),
					"new.",
				].join(" "),
				headline: "Article statistics:",
			});
			previousCount = trainingData.length;
		}
	}, 5000);
	const plagiarismArticles = await Bluebird.props({
		wikipedia: WikipediaFetcher.fetchArticle("plagiarism"),
	});
	log({
		detail: plagiarismArticles.wikipedia.render.split(/\n/, 1)[0],
		headline: "Presenting article:",
	});
	await Bluebird.each(
		plagiarismArticles.wikipedia.trainingData.fetchers,
		async (fetcher) => {
			try {
				const article = await fetcher();
				log({
					detail: article.split(/\n/, 1)[0],
					headline: "Learnt article:",
				});
				trainingData.push(article);
			} catch (error) {
				log({
					detail: error.message,
					error: true,
					headline: "Oh no!",
				});
			}
		},
	);
	log({
		detail: [trainingData.length.toString(), "articles"].join(" "),
		headline: "Final statistics",
	});
	return [monitor];
}

function stop(timeout: NodeJS.Timeout[]): void {
	timeout.forEach(clearInterval);
}

start().then(stop);
