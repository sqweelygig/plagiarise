import * as CookieJar from "fortune-cookie";
import { sample } from "lodash";
import { BrainWriter, BrainWriterFunctions } from "../brain-writer";

export class FortuneCookie extends BrainWriter<{}> {
	public constructor(props: BrainWriterFunctions) {
		super(props);
		setTimeout(async () => {
			const fulltext = '"' + sample(CookieJar) + '"';
			await this.props.updateBrain({ fulltext });
		}, 0);
	}
}
