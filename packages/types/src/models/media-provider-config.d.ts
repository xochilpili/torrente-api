export interface IMovieFestivalsUrl {
	cannes?: string;
	bifa?: string;
	sitges?: string;
	stSebastian?: string;
	emmy?: string;
	tiff?: string;
	venice?: string;
	oscars?: string;
	goya?: string;
	goldenGlobe?: string;
	berlin?: string;
}

export interface IMovieCategoryUrl {
	all?: string;
	movie?: string;
	serie?: string;
	genres?: string; // TODO! Define a genere [ action | drama ] etc... subCategory
	country?: string; // ^ same
	hbo?: string;
	netflix?: string;
	usa?: string;
	france?: string;
	uk?: string;
	festivalsUrlSelector?: IMovieFestivalsUrl;
}

export interface IMovieSubItemSelector {
	imageUrlSelector?: string;
	rawTextSelector?: string;
	imdbIdSelector?: string;
	castSelector?: string[];
	genresSelector?: string[];
	torrentSelector?: string;
	subtitleSelector?: string;
	directorSelector?: string;
}

export interface IMovieItemsSelector {
	titleSelector: string;
	directorSelector?: string;
	castSelector?: string;
	imageUrlSelector: string;
	qualitySelector?: string;
	countrySelector?: string;
	rawTextSelector?: string;
	subItemLinkSelector?: string;
	subItemsSelector?: IMovieSubItemSelector;
}

export interface IMovieProvider {
	name: '300mbfilms' | 'fMovies' | 'subAdictos' | 'festivals' | 'filmAffinity';
	type: 'scraper' | 'json';
	active: boolean;
	url: string;
	categorySelector: IMovieCategoryUrl;
	itemSelector: string;
	itemsSelector: IMovieItemsSelector;
	pagination: string;
	pagePattern?: string;
}
