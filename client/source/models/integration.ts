import { PureComponent } from "react";
import { BrainValues, BrainWriterFunctions } from "./brain";

type IntegrationProps = BrainValues & BrainWriterFunctions;

export abstract class Integration extends PureComponent<IntegrationProps> {
	public render(): null {
		return null;
	}
}
