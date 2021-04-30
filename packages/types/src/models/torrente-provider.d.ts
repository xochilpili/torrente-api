export interface IMovieCategoryUrl {
	all: string;
	movie: string;
	serie: string;
}

export interface IMovieItemsSelector {
	title: string;
	titleSearch: string;
	imdbId: string;
	genres: string;
	imageUrl: string;
	quality?: string;
	items?: string;
}

export interface IMovieProvider {
	name: '300mbfilms' | 'fMovies' | 'subAdictos' | 'subAdictosIndex' | 'festivals';
	type: 'scraper' | 'json';
	active: boolean;
	url: string;
	category: IMovieCategoryUrl;
	genres?: string;
	country?: string;
	itemSelector: string;
	itemsSelector: IMovieItemsSelector;
	pagination: string;
	pagePattern?: string;
}
