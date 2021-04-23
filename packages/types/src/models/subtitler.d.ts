export interface ISearchOptions {
	query: string;
	lang?: string[];
	extensions?: string[];
	limit?: 'all' | 'best' | number;
	imdbid?: string;
	fps?: number;
	season?: number;
	episode?: number;
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
