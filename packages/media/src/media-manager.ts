import { Helpers } from './../../utils/src/shared/helpers';
import {
	IMediaItem,
	IMediaSearchOptions,
	IMovieProvider,
	IGenericTorrent,
	ITorrentSearchOptions,
	IGenericSubtitle,
	ISearchOptions,
} from '@paranoids/torrente-types';
import { Providers } from './media-provider.config';
import { MediaController } from './controllers/media.controller';
import { TorrentService } from './services/torrent.service';
import { SubtitlerService } from './services/subtitler.service';

export class MediaManager {
	private _providers: IMovieProvider[];
	private _controllers: MediaController[];

	constructor() {
		this._providers = Providers;
		this._controllers = this.getActiveProviders().map((provider: IMovieProvider) => new MediaController(provider));
	}

	public activateProvider(provider: string[]): void {
		this._providers
			.filter((p: IMovieProvider) =>
				Array.isArray(provider) && provider.length > 0 ? provider.some((s: string) => s.toLowerCase() === p.name.toLowerCase()) : null
			)
			.map((p) => (p.active = true));
	}

	public getActiveProviders(): IMovieProvider[] {
		return this._providers.filter((provider) => provider.active);
	}

	public deactiveProvider(provider: string[]): void {
		this._providers
			.filter((p: IMovieProvider) =>
				Array.isArray(provider) && provider.length > 0 ? provider.some((s: string) => s.toLowerCase() === p.name.toLowerCase()) : null
			)
			.map((p) => (p.active = false));
	}

	public disableAllProviders(): void {
		this._providers.map((p: IMovieProvider) => (p.active = false));
	}

	public activeAllProviders(): void {
		this._providers.map((p: IMovieProvider) => (p.active = true));
	}

	async getReleases(searchOptions: IMediaSearchOptions): Promise<IMediaItem[]> {
		const results: IMediaItem[][] = await Promise.all(
			this._controllers.filter((controller) => controller['_provider'].active).map((controller) => controller.getReleases(searchOptions))
		);
		let filtered: IMediaItem[] = this.postFilter(results.flat(4), searchOptions);
		if (searchOptions.includeTorrent) {
			const subAdictos = filtered.filter((item: IMediaItem) => item.provider === 'subAdictos');
			const torrent = await this.getTorrents(
				filtered.filter((item) => item.provider !== 'subAdictos'),
				searchOptions.torrentSearchOptions
			);
			filtered = subAdictos.concat(torrent);
		}
		if (searchOptions.onlySubtitled) {
			const subAdictos = filtered.filter((item: IMediaItem) => item.provider === 'subAdictos');
			const subtitles = await this.getSubtitles(
				filtered.filter((item) => item.provider !== 'subAdictos'),
				searchOptions.subtitlerSearchOptions
			);
			filtered = subAdictos.concat(subtitles);
		}
		return filtered;
	}

	private postFilter(results: IMediaItem[], searchOptions: IMediaSearchOptions): IMediaItem[] {
		let filtered: IMediaItem[] = results;

		if (searchOptions.excludeGenres && searchOptions.excludeGenres.length > 0) {
			filtered = filtered.filter((item: IMediaItem) => {
				if (item.genres) {
					return !searchOptions.excludeGenres.some((genre: string) => item.genres.indexOf(genre.toLowerCase().trim()) >= 0);
				}
			});
		}

		if (searchOptions.excludeActors && searchOptions.excludeActors.length > 0) {
			filtered = filtered.filter((item: IMediaItem) => {
				if (item.cast) {
					return !searchOptions.excludeActors.some((actor: string) => item.cast.indexOf(actor.toLowerCase().trim()) >= 0);
				}
			});
		}

		filtered = filtered.filter((item: IMediaItem) => item.title !== '' || item.title !== undefined);
		return filtered;
	}

	private async getTorrents(items: IMediaItem[], torrentSearchOptions: ITorrentSearchOptions): Promise<IMediaItem[]> {
		const results: IMediaItem[] = await Promise.all(
			items.map(async (item: IMediaItem) => {
				await Helpers.sleep(1000);
				const torrents: IGenericTorrent[] = await TorrentService.getTorrents({
					query:
						item.type == 'movie'
							? `${item.title} ${item.year}`
							: `${item.title} s${item.season.toString().padStart(2, '0')}${
									item.episode ? 'e' + item.episode.toString().padStart(2, '0') : 'e01'
							  }`,
					...torrentSearchOptions,
				});
				return { ...item, torrent: torrents };
			})
		);
		return results;
	}

	private async getSubtitles(items: IMediaItem[], subtitleSearchOptions: ISearchOptions): Promise<IMediaItem[]> {
		const results: IMediaItem[] = await Promise.all(
			items.map(async (item: IMediaItem) => {
				const subtitles: IGenericSubtitle[] = await SubtitlerService.getSubtitles({
					query: item.type === 'serie' ? (!item.season && !item.episode ? `${item.title} s01e01` : item.title) : item.title,
					...(item.season && { season: item.season }),
					...(item.episode && { episode: item.episode }),
					...(item.year && { year: item.year.toString() }),
					...subtitleSearchOptions,
				});
				return { ...item, subtitles: subtitles };
			})
		);
		return results;
	}
}
