export interface IOpenSubsItem {
	provider: 'opensubtitles';
	type?: 'movie' | 'serie' | 'sport';
	id: string;
	url: string;
	langcode: string;
	downloads: number;
	encoding: string;
	title: string;
	filename: string;
	date: Date;
	score: number;
	fps: number;
	format: string;
	utf8: string;
	vtt: string;
	link: string;
	releases?: string[];
	quality?: string[];
	size?: string;
	year?: string;
	season?: number;
	episode?: number;
}
