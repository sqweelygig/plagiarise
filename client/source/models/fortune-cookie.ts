import * as CookieJar from "fortune-cookie";
import { sample } from "lodash";
import { BrainWriterFunctions, SimpleBrainWriter } from "./brain";

export const fetch: SimpleBrainWriter = async (
	writers: BrainWriterFunctions,
): Promise<void> => {
	const text = sample(CookieJar);
	if (text) {
		const fulltext = '"' + sample(CookieJar) + '"';
		await writers.update({ fulltext });
	}
};
