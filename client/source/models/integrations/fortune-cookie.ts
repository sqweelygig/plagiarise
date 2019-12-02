import * as CookieJar from "fortune-cookie";
import { sample } from "lodash";
import { BrainValues, BrainWriterFunctions } from "../brain";
import { Integration } from "../integration";

export class FortuneCookie extends Integration {
	public constructor(props: BrainValues & BrainWriterFunctions) {
		super(props);
		setTimeout(async () => {
			const fulltext = '"' + sample(CookieJar) + '"';
			await this.props.updateBrain({ fulltext });
		}, 0);
	}
}
