export default class Helpers {
	static uniqArray(elements: string[]): string[] {
		return elements
			.map((item) => item)
			.map((element, index, final) => final.indexOf(element) === index && index)
			.filter((element) => elements[element])
			.map((element) => elements[element]);
	}
}
