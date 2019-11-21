import * as CookieJar from "fortune-cookie";
import { sample } from "lodash";
import { BrainAdder } from "../../editor";

export async function fetch(
	addItem: BrainAdder,
): Promise<void> {
	const fulltext = "\"" + sample(CookieJar) + "\"";
	if (fulltext) {
		addItem({
			fulltext,
			source: "fortune cookies",
		});
	}
}
