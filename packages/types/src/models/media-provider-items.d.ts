import { IGenericSubtitle } from './subtitler';

export interface IGenericItem {
	provider: '300mbfilms' | 'fMovies' | 'subAdictos' | 'festivals' | 'filmAffinity';
	title?: string;
	originalTitle: string;
	type?: 'movie' | 'serie' | 'sport' | 'documentary';
	subLink?: string;
	country?: string;
	director?: string;
	cast?: string[];
	imdbId?: string;
	imageUrl: string;
	year?: string;
	genres?: string[];
	rawText?: string;
	torrent?: string;
	subtitles?: IGenericSubtitle[];
	season?: number;
	episode?: number;
}
