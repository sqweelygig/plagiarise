/* tslint:disable:no-console */
import * as Bluebird from "bluebird";
import { Wikipedia } from "./wikipedia";

async function start(): Promise<void> {
	console.log("Hello World!");
	const plagiarism = await Bluebird.props({
		wikipedia: Wikipedia.fetchArticle(["plagiarism"]),
	});
	console.log(
		plagiarism.wikipedia.render.length,
		plagiarism.wikipedia.render.substr(0, 1500),
	);
	const trainingData = await Bluebird.map(
		plagiarism.wikipedia.trainingData.fetchers,
		async (fetcher, index) => {
			const data = await fetcher();
			console.log(index, data.split("\n", 1)[0]);
			return data;
		},
		{
			concurrency: plagiarism.wikipedia.trainingData.concurrency,
		},
	);
	console.log(trainingData.length);
}
start().then(() => {
	/* do nothing */
});
