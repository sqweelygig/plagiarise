import * as CookieJar from "fortune-cookie";
import { sample } from "lodash";
import { BrainWriter, WriterProps } from "../brain-writer";

export class FortuneCookie extends BrainWriter<{}> {
	public constructor(props: WriterProps) {
		super(props);
		setTimeout(async () => {
			const fulltext = '"' + sample(CookieJar) + '"';
			await this.props.updateBrain({ fulltext });
		}, 0);
	}
}
