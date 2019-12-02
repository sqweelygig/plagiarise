declare module "fortune-cookie" {
	const fortuneCookies: string[];
	export = fortuneCookies;
}

declare module "keyword-extractor" {
	function extract(sentence: string): string[];
}
