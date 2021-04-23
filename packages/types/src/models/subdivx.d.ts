export interface ISubdivxItemScraper {
	titles: string[];
	links: string[];
	descs: string[];
}

export interface ISubdivxItem {
	provider: 'subdivx';
	type?: 'movie' | 'serie' | 'sport';
	title: string;
	link: string;
	desc: string;
	releases?: string[];
	quality?: string[];
	size?: string;
	year?: string;
	season?: number;
	episode?: number;
}
