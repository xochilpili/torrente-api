import { ISearchOptions } from './subtitler.d';
import { ITorrentSearchOptions, ITorrentItem } from './torrent';
import { IGenericSubtitle } from './subtitler';

export interface IPlexCredentials {
	username: string;
	password: string;
}
export interface IPlexSettings {
	plex: { host: string; creds: IPlexCredentials };
}
export interface IMediaOptions {
	includeSqlite: boolean;
	includePlex: boolean;
	plexCredentials?: IPlexSettings;
}

export interface IMediaSearchOptions {
	provider?: string;
	type?: 'movie' | 'serie' | 'all';
	providerCategory:
		| 'all'
		| 'movie'
		| 'serie'
		| 'country'
		| 'genres'
		| 'cannes'
		| 'bifa'
		| 'sitges'
		| 'stSebastian'
		| 'emmy'
		| 'tiff'
		| 'venice'
		| 'oscars'
		| 'goya'
		| 'goldenGlobe'
		| 'berlin'
		| 'hbo'
		| 'netflix'
		| 'usa'
		| 'france'
		| 'uk';
	page?: number;
	pageLimit?: number;
	onlySubtitled: boolean;
	checkPlex: boolean;
	excludeGenres: string[];
	excludeActors: string[];
	includeTorrent: boolean;
	includeMagnet: boolean;
	torrentSearchOptions: ITorrentSearchOptions;
	subtitlerSearchOptions: ISearchOptions;
}

export interface IMediaItem {
	provider: '300mbfilms' | 'fMovies' | 'subAdictos' | 'festivals' | 'filmAffinity';
	title: string;
	originalTitle: string;
	type?: 'movie' | 'serie' | 'sport' | 'documentary';
	imdbId?: string;
	portrait: string;
	country?: string;
	year: number;
	director?: string;
	cast?: string[];
	genres: string[];
	torrents?: string | ITorrentItem[];
	subtitles?: string | IGenericSubtitle[];
	season?: number;
	episode?: number;
}
