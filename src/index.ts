/* tslint:disable:no-console */
import * as Bluebird from "bluebird";
import { Wikipedia } from "./wikipedia";

async function start(): Promise<void> {
	console.log("================");
	console.log("Hello World!");
	console.log("----------------");
	const plagiarism = await Bluebird.props({
		wikipedia: Wikipedia.fetchArticle("plagiarism"),
	});
	console.log(
		plagiarism.wikipedia.render.length,
		plagiarism.wikipedia.render.substr(0, 1500),
	);
	const trainingData = await Bluebird.map(
		plagiarism.wikipedia.trainingData.fetchers,
		(fetcher) => {
			return fetcher();
		},
		{
			concurrency: plagiarism.wikipedia.trainingData.concurrency,
		},
	);
	console.log("----------------");
	console.log(trainingData.length, trainingData[0].split("\n", 1)[0]);
	console.log("================");
}
start().then(() => {
	/* do nothing */
});
