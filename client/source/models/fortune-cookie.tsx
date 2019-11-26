import * as CookieJar from "fortune-cookie";
import { sample } from "lodash";
import { BrainUpdater } from "../editor";

export async function fetch(updateBrain: BrainUpdater): Promise<void> {
	const text = sample(CookieJar);
	if (text) {
		const fulltext = '"' + sample(CookieJar) + '"';
		updateBrain({ fulltext });
	}
}
