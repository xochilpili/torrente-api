export class Helpers {
	static uniqArray(elements: string[]): string[] {
		return elements
			.map((item) => item.toLowerCase())
			.map((element, index, final) => final.indexOf(element) === index && index)
			.filter((element) => elements[element])
			.map((element) => elements[element])
			.map((item) => item.toLowerCase());
	}

	static async sleep(ms: number): Promise<void> {
		return new Promise((resolve) => {
			setTimeout(resolve, ms);
		});
	}
}
