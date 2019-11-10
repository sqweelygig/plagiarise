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
}
start().then(() => {
	/* do nothing */
});
