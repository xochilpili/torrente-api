import { makeDriver, baseHeaders, Parsers, Helpers } from '@paranoids/torrente-utils';
import { IMediaSearchOptions, IMovieProvider, IGenericItem, IMediaItem } from '@paranoids/torrente-types';
import xray from 'x-ray-scraper/Xray';

export class MediaController {
	private _provider: IMovieProvider;
	private _xray: xray;

	constructor(provider: IMovieProvider) {
		this._provider = provider;
		this._xray = xray();
		this._xray.driver(makeDriver(baseHeaders));
	}

	public async getReleases(searchOptions: IMediaSearchOptions): Promise<IMediaItem[]> {
		let results: IMediaItem[];
		if (
			(searchOptions.provider === 'festivals' ||
				searchOptions.provider === 'filmAffinity' ||
				this._provider.name === 'festivals' ||
				this._provider.name === 'filmAffinity') &&
			searchOptions.providerCategory === 'all'
		) {
			const provider: string = searchOptions.provider || this._provider.name;
			results = await this.getBatchReleases(provider);
			return results;
		}
		const url = this.getProviderUrl(searchOptions.providerCategory, searchOptions.page);

		results = await this.fetchAndParse(url);
		return results;
	}

	private async fetchAndParse(url: string): Promise<IMediaItem[]> {
		let results: IGenericItem[] = await this._xray(url, this._provider.itemSelector, [
			{
				title: this._provider.itemsSelector.titleSelector,
				originalTitle: this._provider.itemsSelector.titleSelector,
				...(this._provider.itemsSelector.imageUrlSelector && {
					imageUrl: this._provider.itemsSelector.imageUrlSelector,
				}),
				...(this._provider.itemsSelector.rawTextSelector && {
					rawText: this._provider.itemsSelector.rawTextSelector,
				}),
				...(this._provider.itemsSelector.directorSelector && {
					director: this._provider.itemsSelector.directorSelector,
				}),
				...(this._provider.itemsSelector.castSelector && { cast: this._provider.itemsSelector.castSelector }),
				...(this._provider.itemsSelector.countrySelector && {
					country: this._provider.itemsSelector.countrySelector,
				}),
				...(this._provider.itemsSelector.subItemLinkSelector && {
					subLink: this._provider.itemsSelector.subItemLinkSelector,
				}),
				...(this._provider.itemsSelector.qualitySelector && {
					quality: this._provider.itemsSelector.qualitySelector,
				}),
			},
		]);

		if (
			this._provider.name === 'subAdictos' ||
			this._provider.name === 'fMovies' ||
			this._provider.name === 'festivals' ||
			this._provider.name === 'filmAffinity'
		) {
			await Helpers.sleep(3000);
			const subProcess = results.map(async (item: IGenericItem) => {
				const subItems: IGenericItem = await this._xray(item.subLink, {
					...(this._provider.itemsSelector.subItemsSelector.imageUrlSelector && {
						imageUrl: this._provider.itemsSelector.subItemsSelector.imageUrlSelector,
					}),
					...(this._provider.itemsSelector.subItemsSelector.rawTextSelector && {
						rawText: this._provider.itemsSelector.subItemsSelector.rawTextSelector,
					}),
					...(this._provider.itemsSelector.subItemsSelector.imdbIdSelector && {
						imdbId: this._provider.itemsSelector.subItemsSelector.imdbIdSelector,
					}),
					...(this._provider.itemsSelector.subItemsSelector.torrentSelector && {
						torrent: this._provider.itemsSelector.subItemsSelector.torrentSelector,
					}),
					...(this._provider.itemsSelector.subItemsSelector.subtitleSelector && {
						subtitles: this._provider.itemsSelector.subItemsSelector.subtitleSelector,
					}),
					...(this._provider.itemsSelector.subItemsSelector.directorSelector && {
						director: this._provider.itemsSelector.subItemsSelector.directorSelector,
					}),
					...(this._provider.itemsSelector.subItemsSelector.castSelector && {
						cast: this._provider.itemsSelector.subItemsSelector.castSelector,
					}),
					...(this._provider.itemsSelector.subItemsSelector.genresSelector && {
						genres: this._provider.itemsSelector.subItemsSelector.genresSelector,
					}),
				});
				return { ...item, ...subItems };
			});
			results = await Promise.all(subProcess);
		}
		const items: IMediaItem[] = results.map((item: IGenericItem) => Parsers.parseMediaItem({ provider: this._provider.name, ...item }));
		return items;
	}

	private async getBatchReleases(provider: string): Promise<IMediaItem[]> {
		const festivals: Promise<IMediaItem[]>[] = Object.keys(
			provider === 'festivals' ? this._provider.categorySelector.festivalsUrlSelector : this._provider.categorySelector
		).map(async (category: string) => {
			const url: string = this.getProviderUrl(category, 0);
			await Helpers.sleep(6000);
			const results: IMediaItem[] = await this.fetchAndParse(url);
			return results;
		});
		const items = await Promise.all(festivals);
		return items.flat(4);
	}

	private getProviderUrl(category: string, page: number): string {
		switch (this._provider.name) {
		case 'festivals':
			return `${this._provider.url}${this._provider.categorySelector.festivalsUrlSelector[category]}`;
		default:
			return `${this._provider.url}${this._provider.categorySelector[category]}${page && page > 1 ? this._provider.pagePattern + page : ''}`;
		}
	}
}
