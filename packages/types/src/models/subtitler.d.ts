export interface ISearchOptions {
	query: string;
	lang?: string[];
	year?: string;
	season?: number;
	episode?: number;
	provider?: 'subdivx' | 'subscene' | 'opensubtitles';
	releases?: string[];
	quality?: string[];
}

export interface IGenericSubtitle {
	provider: 'subdivx' | 'subscene' | 'opensubtitles';
	type: 'movie' | 'serie' | 'sport';
	title: string;
	link: string;
	releases: string[];
	quality: string[];
	year: string;
	lang?: string;
	filename?: string;
	season?: number;
	episode?: number;
}
