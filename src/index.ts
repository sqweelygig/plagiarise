/* tslint:disable:no-console */
import * as Bluebird from "bluebird";
import * as Chalk from "chalk";
import { compact } from "lodash";
import { Wikipedia } from "./wikipedia";

async function start(): Promise<void> {
	console.log(Chalk.blue("Hello World!"));
	const plagiarism = await Bluebird.props({
		wikipedia: Wikipedia.fetchArticle("plagiarism"),
	});
	console.log(
		Chalk.blue("Presenting article:"),
		plagiarism.wikipedia.render.split(/\n/, 1)[0],
	);
	const trainingData = compact(
		await Bluebird.map(
			plagiarism.wikipedia.trainingData.fetchers,
			async (fetcher) => {
				try {
					const article = await fetcher();
					console.log(Chalk.blue("Learnt article:"), article.split(/\n/, 1)[0]);
					return article;
				} catch (error) {
					console.error(Chalk.red("Oh no!"), error.message);
					return null;
				}
			},
			{
				concurrency: plagiarism.wikipedia.trainingData.concurrency,
			},
		),
	);
	console.log(Chalk.blue("Article count:"), trainingData.length.toString());
}
start().then(() => {
	/* do nothing */
});
