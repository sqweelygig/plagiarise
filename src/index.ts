/* tslint:disable:no-console */
import * as Bluebird from "bluebird";
import * as Chalk from "chalk";
import { fetchArticle as fetchWikipediaArticle } from "./wikipediaFetcher";

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
	const updateRender = (render: string) => {
		log({
			detail: render.split(/\n/, 1)[0],
			headline: "Presenting article:",
		});
	};
	const reportError = (error: Error) => {
		log({
			detail: error.message,
			error: true,
			headline: "Oh no!",
		});
	};
	const appendTrainingData = (newData: string) => {
		log({
			detail: newData.split(/\n/, 1)[0],
			headline: "Learnt article:",
		});
		trainingData.push(newData);
	};
	await Bluebird.props({
		wikipedia: fetchWikipediaArticle({
			appendTrainingData,
			header: "plagiarism",
			reportError,
			updateRender,
		}),
	});
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
